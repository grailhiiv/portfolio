export type ManualAttachment = { url: string; name: string; dataUrl: string };

/** An attachment with a known source must not silently follow an edited link. */
export function screenshotSourceMatches(boundUrl: string, currentUrl: string) {
  return Boolean(boundUrl.trim()) && boundUrl.trim() === currentUrl.trim();
}

/** Links are identifiers only: this function never fetches a source. */
export function prepareManualEvidence(urls: string[], attachments: ManualAttachment[], checkedAt: string, makeId: () => string = () => crypto.randomUUID()) {
  const evidenceUrls = [...new Set(attachments.map(item => item.url))];
  const sources = [...new Set(urls)].map(url => ({
    url,
    status: evidenceUrls.includes(url) ? "accessible" : "unavailable",
    message: evidenceUrls.includes(url) ? "User-provided screenshots; capture date unknown." : "No screenshots provided; link not accessed.",
    checkedAt,
    images: attachments.flatMap(item => item.url === url ? [{ kind: `manual:${makeId()}`, name: item.name.slice(0, 150), dataUrl: item.dataUrl }] : []),
  }));
  return { sources, evidenceUrls };
}
