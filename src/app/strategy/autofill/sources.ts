import type { Draft } from "../schema";
import { clean } from "./evidence";

function isSafePublicUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return null;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "[::1]" ||
      host.endsWith(".local") ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractUrlsFromText(text: string): string[] {
  const safeText = clean(text);
  if (!safeText) return [];
  const matches = safeText.match(/https?:\/\/[^\s"'<>)\]]+/gi) ?? [];
  return Array.from(new Set(matches.map((u) => u.replace(/[.,;!?]+$/, ""))));
}

function stripHtmlToReadableText(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaMatches = Array.from(
    html.matchAll(
      /<meta\s+[^>]*?(?:name|property)=["']([^"']+)["'][^>]*?content=["']([^"']+)["'][^>]*?>/gi,
    ),
  );
  const metaLines: string[] = [];
  if (titleMatch?.[1]) {
    metaLines.push(`Page Title: ${titleMatch[1].replace(/\s+/g, " ").trim()}`);
  }
  for (const m of metaMatches) {
    const key = m[1]?.toLowerCase() ?? "";
    const val = m[2]?.replace(/\s+/g, " ").trim() ?? "";
    if (
      val &&
      (key.includes("description") ||
        key.includes("title") ||
        key.includes("site_name"))
    ) {
      metaLines.push(`${m[1]}: ${val}`);
    }
  }

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr|section|article|header|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, 5500);

  return [...metaLines, bodyText].filter(Boolean).join("\n");
}

export async function fetchPublicSources(draft: Draft): Promise<string> {
  const websiteRaw = clean(draft.website);
  const candidateUrls = Array.from(
    new Set([
      ...extractUrlsFromText(draft.mainSource),
      ...(websiteRaw
        ? extractUrlsFromText(
            websiteRaw.startsWith("http")
              ? websiteRaw
              : `https://${websiteRaw}`,
          )
        : []),
      ...(draft.profiles ?? []).map((p) => clean(p?.url)).filter(Boolean),
    ]),
  )
    .map(isSafePublicUrl)
    .filter((u): u is URL => u !== null)
    .slice(0, 3);

  if (!candidateUrls.length) return "";

  const results = await Promise.all(
    candidateUrls.map(async (urlObj) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5500);
      try {
        const res = await fetch(urlObj.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; GrailhiivStrategyBot/1.0)",
            Accept:
              "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
          },
          signal: controller.signal,
        });
        if (!res.ok) return "";
        const raw = await res.text();
        const cleaned = stripHtmlToReadableText(raw);
        return cleaned
          ? `--- Live Source (${urlObj.toString()}) ---\n${cleaned}`
          : "";
      } catch {
        return "";
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  return results.filter(Boolean).join("\n\n");
}
