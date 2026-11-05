export type PageSpeedResult = { status: "available" | "unavailable"; url: string; checkedAt: string; score: number | null; message: string };

// Never forward query parameters or fragments, which can contain private tokens.
export async function inspectPageSpeed(rawUrl: string, fetcher: typeof fetch = fetch): Promise<PageSpeedResult> {
  const url = new URL(rawUrl);
  url.search = "";
  url.hash = "";
  const target = url.toString();
  const checkedAt = new Date().toISOString();
  const unavailable = (message: string): PageSpeedResult => ({ status: "unavailable", url: target, checkedAt, score: null, message });
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  try {
    const response = await fetcher(endpoint, { signal: AbortSignal.timeout(25_000), cache: "no-store" });
    if (!response.ok) return unavailable(`PageSpeed Insights was unavailable (HTTP ${response.status}).`);
    const data = await response.json();
    const score = data?.lighthouseResult?.categories?.performance?.score;
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1) return unavailable("PageSpeed Insights returned no performance score.");
    return { status: "available", url: target, checkedAt, score: Math.round(score * 100), message: "Mobile Lighthouse lab performance score; not real-user analytics." };
  } catch {
    return unavailable("PageSpeed Insights could not complete the check.");
  }
}
