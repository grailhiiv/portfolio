import assert from 'node:assert/strict';
import test from 'node:test';
import { registerHooks } from 'node:module';
import { chromium } from 'playwright';
registerHooks({ resolve(specifier, context, nextResolve) {
  try { return nextResolve(specifier, context); } catch (error) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.ts`, context);
    throw error;
  }
} });
const { renderSource } = await import('../src/app/strategy/autofill/research-pages.ts');
test('restricted render executes inline scripts while blocking private network resources', async () => {
  assert.equal(typeof renderSource, 'function');
  const browser = await chromium.launch({ headless: true });
  try {
    const result = await renderSource(browser, { url: 'https://example.com/', finalUrl: 'https://example.com/', status: 'accessible', text: '', message: '', checkedAt: '', html: `<html><body><p id="content">Before</p><script>document.querySelector('#content').textContent = 'Rendered by JavaScript';</script><img src="http://127.0.0.1/private"></body></html>` }, false);
    assert.match(result.text, /Rendered by JavaScript/);
    assert.ok(result.blocked >= 1);
    assert.ok(result.screenshot.length > 100);
  } finally { await browser.close(); }
});
import { gzipSync, deflateSync, brotliCompressSync } from 'node:zlib';
import { decodeResource } from '../src/app/strategy/autofill/collect-source.ts';
test('compressed CSS is decoded and decompression is bounded', () => {
  const css = Buffer.from('body { background: purple; }');
  for (const [encoding, compress] of [['gzip', gzipSync], ['deflate', deflateSync], ['br', brotliCompressSync]]) {
    assert.deepEqual(decodeResource(compress(css), encoding, 1024), css);
    assert.throws(() => decodeResource(compress(css), encoding, 4));
  }
});
