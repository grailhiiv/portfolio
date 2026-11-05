import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import ipaddr from "ipaddr.js";

export type SourceResult = { url: string; finalUrl?: string; status: "accessible" | "unavailable"; text: string; html?: string; message: string; checkedAt: string };
export type PublicResource = { url: string; type: string; bytes: Buffer };

export function decodeResource(bytes: Buffer, encoding: string, maxBytes: number): Buffer {
  const options = { maxOutputLength: maxBytes };
  if (encoding === "identity") return bytes;
  if (encoding === "gzip") return gunzipSync(bytes, options);
  if (encoding === "deflate") return inflateSync(bytes, options);
  if (encoding === "br") return brotliDecompressSync(bytes, options);
  throw new Error("Unsupported content encoding.");
}

/** Pin a validated public address for every request and redirect. */
export async function fetchPublicResource(raw: string, maxBytes = 1_000_000): Promise<PublicResource> {
  let url = new URL(raw);
  for (let hops = 0; hops < 4; hops++) {
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || (url.port && !["80", "443"].includes(url.port))) throw new Error("Invalid public HTTP(S) URL.");
    const hostname = url.hostname.replace(/^\[|\]$/g, "");
    const records = ipaddr.isValid(hostname) ? [{ address: hostname, family: ipaddr.parse(hostname).kind() === "ipv4" ? 4 : 6 }] : await Promise.race([lookup(hostname, { all: true, verbatim: true }), new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DNS lookup timed out.")), 8000))]);
    if (!records.length || records.some(record => ipaddr.process(record.address).range() !== "unicast")) throw new Error("Non-public network destination blocked.");
    const selected = records[0];
    const result = await new Promise<{ status: number; location?: string; type: string; encoding: string; bytes: Buffer }>((resolve, reject) => {
      const makeRequest = url.protocol === "https:" ? httpsRequest : httpRequest;
      const req = makeRequest(url, { headers: { "user-agent": "GrailhiivStrategyBot/1.0", accept: "*/*" }, lookup: (_hostname, options, callback) => { if (options.all) callback(null, [selected] as never); else callback(null, selected.address, selected.family as 4 | 6); } }, res => {
        const chunks: Buffer[] = []; let bytes = 0;
        res.on("data", (chunk: Buffer) => { bytes += chunk.length; if (bytes > maxBytes) req.destroy(new Error("Source exceeds size limit.")); else chunks.push(chunk); });
        res.on("end", () => resolve({ status: res.statusCode ?? 0, location: res.headers.location, type: res.headers["content-type"] ?? "", encoding: (res.headers["content-encoding"] ?? "identity").toLowerCase(), bytes: Buffer.concat(chunks) }));
        res.on("error", reject);
      });
      const deadline = setTimeout(() => req.destroy(new Error("Source timed out.")), 8000);
      req.on("close", () => clearTimeout(deadline)); req.on("error", reject); req.end();
    });
    if (result.status >= 300 && result.status < 400 && result.location) { url = new URL(result.location, url); continue; }
    if (result.status < 200 || result.status >= 300) throw new Error(`Source returned HTTP ${result.status}.`);
    const bytes = decodeResource(result.bytes, result.encoding, maxBytes);
    return { url: url.toString(), type: result.type, bytes };
  }
  throw new Error("Too many redirects.");
}

export async function collectSource(raw: string): Promise<SourceResult> {
  const checkedAt = new Date().toISOString();
  try {
    const result = await fetchPublicResource(raw);
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(result.type)) throw new Error("Source is not an HTML or text page.");
    const html = result.bytes.toString("utf8");
    const text = html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim().slice(0, 9000);
    if (text.length < 80) return { url: raw, finalUrl: result.url, status: "unavailable", text: "", html, message: "The page did not expose enough readable text before rendering.", checkedAt };
    return { url: raw, finalUrl: result.url, status: "accessible", text, html, message: `Retrieved ${new URL(result.url).hostname}.`, checkedAt };
  } catch (error) { return { url: raw, status: "unavailable", text: "", message: error instanceof Error ? error.message : "Could not retrieve source.", checkedAt }; }
}
