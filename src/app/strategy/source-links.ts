import type { Profile } from "./schema";

const platforms: [string, string[]][] = [
  ["Facebook", ["facebook.com", "fb.com"]], ["Instagram", ["instagram.com"]],
  ["LinkedIn", ["linkedin.com"]], ["TikTok", ["tiktok.com"]],
  ["YouTube", ["youtube.com", "youtu.be"]], ["Pinterest", ["pinterest.com"]],
  ["Threads", ["threads.net", "threads.com"]], ["X", ["x.com", "twitter.com"]],
  ["Bluesky", ["bsky.app"]], ["Substack", ["substack.com"]],
  ["Goodreads", ["goodreads.com"]], ["Amazon Author Central", ["amazon.com", "amazon.ca", "amazon.co.uk", "amazon.com.au", "amazon.de", "amazon.fr", "amazon.it", "amazon.es", "amazon.co.jp", "amazon.in", "amazon.com.br", "amazon.com.mx", "amazon.sg", "amazon.ae", "amazon.nl", "amazon.se", "amazon.pl"]],
];
export function sourcePlatform(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    return platforms.find(([, domains]) => domains.some(domain => host === domain || host.endsWith(`.${domain}`)))?.[0] ?? null;
  } catch { return null; }
}
export function sourceKey(raw: string): string {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return "";
    const host = url.hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");
    const identityQuery = host.endsWith("facebook.com") && url.pathname.replace(/\/$/, "") === "/profile.php" ? `?id=${url.searchParams.get("id") ?? ""}` : "";
    return `${host}${url.pathname.replace(/\/+$/, "")}${identityQuery}`;
  } catch { return ""; }
}
export function mergeSourceProfiles(raw: string, existing: Profile[]): Profile[] {
  const profiles = [...existing];
  const seen = new Set(existing.map(profile => sourceKey(profile.url)).filter(Boolean));
  for (const value of raw.split(/\s+/)) {
    const platform = sourcePlatform(value); const key = sourceKey(value);
    if (!platform || !key || seen.has(key)) continue;
    profiles.push({ id: crypto.randomUUID(), platform, url: value, notes: "", status: "", followers: "", cadence: "" });
    seen.add(key);
  }
  return profiles;
}

export const auditPlatforms = ["Facebook", "Instagram", "TikTok", "LinkedIn", "Amazon Author Central", "YouTube"] as const;
export type AuditPlatform = typeof auditPlatforms[number];
export type AuditSourceFields = { website: string; profiles: Record<AuditPlatform, string>; extra: string[] };
export function parseAuditSources(raw: string, otherSources: readonly string[] = []): AuditSourceFields {
  const fields: AuditSourceFields = { website: "", profiles: { Facebook: "", Instagram: "", TikTok: "", LinkedIn: "", "Amazon Author Central": "", YouTube: "" }, extra: [] };
  for (const url of raw.split(/\s+/).filter(Boolean)) {
    if (otherSources.includes(url)) { fields.extra.push(url); continue; }
    const platform = sourcePlatform(url);
    if (platform && (auditPlatforms as readonly string[]).includes(platform)) {
      const key = platform as AuditPlatform;
      if (!fields.profiles[key]) fields.profiles[key] = url; else fields.extra.push(url);
    } else if (!platform && sourceKey(url) && !fields.website) fields.website = url;
    else fields.extra.push(url);
  }
  return fields;
}
export function serializeAuditSources(fields: AuditSourceFields): string {
  return [fields.website, ...auditPlatforms.map(platform => fields.profiles[platform]), ...fields.extra].map(value => value.trim()).filter(Boolean).join("\n");
}
