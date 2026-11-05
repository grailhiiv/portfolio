import { chromium, type Browser } from "playwright";
import { collectSource, fetchPublicResource, type SourceResult } from "./collect-source";

export type RenderedPage = { source: SourceResult; screenshot?: string; mobileScreenshot?: string; links: string[]; metadata?: string; renderNote: string };
const SOCIAL = /(^|\.)(facebook\.com|instagram\.com|linkedin\.com|tiktok\.com|youtube\.com|x\.com|twitter\.com|amazon\.(?:com(?:\.au|\.br|\.mx)?|co\.(?:uk|jp)|ca|de|fr|it|es|in|sg|ae|nl|se|pl))$/i;

export async function renderSource(browser: Browser, source: SourceResult, mobile: boolean): Promise<{ screenshot: string; links: string[]; blocked: number; metadata: string; text: string }> {
  const context = await browser.newContext({ javaScriptEnabled: true, serviceWorkers: "block", acceptDownloads: false, viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  let count = 0; let blocked = 0;
  try {
    await context.route("**/*", async route => {
      const request = route.request();
      if (request.method() !== "GET" || !["stylesheet", "image", "font", "script"].includes(request.resourceType()) || ++count > 60) { blocked++; await route.abort(); return; }
      try {
        const target = new URL(request.url());
        const result = await fetchPublicResource(target.href, 1_000_000);
        const allowedType = request.resourceType() === "script" ? /^(text|application)\/(javascript|x-javascript|ecmascript)/i.test(result.type) : /^(text\/css|image\/(png|jpeg|webp|gif|svg\+xml)|font\/|application\/(font|vnd\.ms-fontobject|octet-stream))/i.test(result.type);
        if (!allowedType) throw new Error("Unsupported resource.");
        await route.fulfill({ status: 200, contentType: result.type, body: result.bytes });
      } catch { blocked++; await route.abort().catch(() => {}); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const base = source.finalUrl!.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const html = source.html!.replace(/<base\b[^>]*>/gi, "");
    const security = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src http: https: 'unsafe-inline'; img-src http: https: data:; style-src http: https: 'unsafe-inline'; font-src http: https: data:; connect-src 'none'; frame-src 'none'; worker-src 'none'; object-src 'none'; media-src 'none'; form-action 'none'"><base href="${base}">`;
    const htmlDocument = /<head\b[^>]*>/i.test(html) ? html.replace(/<head\b[^>]*>/i, match => `${match}${security}`) : `<!doctype html><html><head>${security}</head><body>${html}</body></html>`;
    await page.setContent(htmlDocument, { waitUntil: "load", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const links = await page.locator("a[href]").evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).href)).catch(() => [] as string[]);
    const metadata = await page.evaluate(() => JSON.stringify({ title: document.title, description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "", headings: Array.from(document.querySelectorAll("h1, h2")).slice(0, 12).map(node => node.textContent?.trim().slice(0, 150)), actions: Array.from(document.querySelectorAll("a, button")).map(node => node.textContent?.trim()).filter(Boolean).slice(0, 30) })).catch(() => "");
    const text = await page.locator("body").innerText({ timeout: 5000 }).then(value => value.replace(/\s+/g, " ").trim().slice(0, 12000)).catch(() => "");
    const height = await page.evaluate(() => Math.min(4000, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight))).catch(() => mobile ? 844 : 900);
    const screenshot = (await page.screenshot({ type: "jpeg", quality: 75, fullPage: true, clip: { x: 0, y: 0, width: mobile ? 390 : 1440, height }, timeout: 10000 })).toString("base64");
    return { screenshot, links, blocked, metadata, text };
  } finally { await context.close(); }
}

/** Render with restricted scripts. All network resources are fetched through the public-address collector. */
export async function researchPages(urls: string[], comprehensive = false): Promise<RenderedPage[]> {
  const sources = await Promise.all(urls.map(collectSource));
  const pages: RenderedPage[] = sources.map(source => ({ source, links: [], renderNote: "Not rendered." }));
  let browser: Browser;
  try { browser = await chromium.launch({ headless: true, args: ["--disable-background-networking", "--disable-features=PreconnectToSearch,NetworkPrediction", "--no-pings", "--disable-quic"] }); }
  catch { return pages.map(page => ({ ...page, renderNote: "Browser unavailable; text only." })); }
  try {
    for (let offset = 0; offset < pages.length; offset += 3) {
      await Promise.all(pages.slice(offset, offset + 3).map(async page => {
        if (!page.source.html || !page.source.finalUrl) return;
        try {
          const desktop = await renderSource(browser, page.source, false);
          page.screenshot = desktop.screenshot; page.links = desktop.links; page.metadata = desktop.metadata;
          if (desktop.text.length >= 80) page.source.text = desktop.text;
          if (page.source.text.length >= 80) { page.source.status = "accessible"; page.source.message = `Retrieved ${new URL(page.source.finalUrl!).hostname}.`; }
          page.renderNote = `Desktop page captured up to 4000px with restricted scripts; ${desktop.blocked} resources skipped. Dynamic API requests are blocked.`;
        } catch { page.renderNote = "Screenshot unavailable; text only."; }
      }));
    }
    const main = pages.find(page => page.screenshot && page.source.finalUrl && !SOCIAL.test(new URL(page.source.finalUrl).hostname));
    if (main) {
      try { main.mobileScreenshot = (await renderSource(browser, main.source, true)).screenshot; } catch { main.renderNote += " Mobile screenshot unavailable."; }
      const origin = new URL(main.source.finalUrl!).origin;
      const existing = new Set(pages.map(page => page.source.finalUrl));
      const candidates = [...new Set(main.links)].filter(link => { try { const url = new URL(link); return url.origin === origin && !existing.has(url.href) && /\b(about|service|contact|book|offer|work)\b/i.test(url.pathname); } catch { return false; } }).slice(0, comprehensive ? 6 : 2);
      for (const url of candidates) {
        const source = await collectSource(url);
        const page: RenderedPage = { source, links: [], renderNote: "Additional page text only." };
        if (source.html && source.finalUrl && new URL(source.finalUrl).origin === origin) {
          try { const result = await renderSource(browser, source, false); page.screenshot = result.screenshot; page.metadata = result.metadata; if (result.text.length >= 80) source.text = result.text; if (source.text.length >= 80) { source.status = "accessible"; source.message = `Retrieved ${new URL(source.finalUrl).hostname}.`; } page.renderNote = `Desktop page captured up to 4000px with restricted scripts; ${result.blocked} resources skipped. Dynamic API requests are blocked.`; } catch { page.renderNote = "Screenshot unavailable; text only."; }
        } else if (source.status === "accessible") { source.status = "unavailable"; source.text = ""; source.html = undefined; source.message = "Page redirected away from the website."; }
        pages.push(page);
      }
    }
  } finally { await browser.close(); }
  return pages;
}
