import type { Draft } from "../schema";
import { clean } from "./evidence";
import { collectSource } from "./collect-source";

export async function fetchPublicSources(draft: Draft): Promise<string> {
  const candidates = [
    ...(clean(draft.auditSources).match(/https?:\/\/[^\s"'<>\])]+/gi) ?? []),
    ...(clean(draft.mainSource).match(/https?:\/\/[^\s"'<>\])]+/gi) ?? []),
    ...(clean(draft.website) ? [draft.website.startsWith("http") ? draft.website : `https://${draft.website}`] : []),
    ...(draft.profiles ?? []).map(profile => clean(profile.url)),
  ];
  const urls = Array.from(new Set(candidates.filter(Boolean))).slice(0, 3);
  const sources = await Promise.all(urls.map(collectSource));
  return sources.filter(source => source.status === "accessible").map(source => `--- Live Source (${source.url}) ---\n${source.text}`).join("\n\n");
}
