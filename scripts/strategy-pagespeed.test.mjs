import test from "node:test";
import assert from "node:assert/strict";
import { inspectPageSpeed } from "../src/app/strategy/audit/pagespeed.ts";

test("mobile lab score is reported without forwarding URL query or fragment", async () => {
  let requested;
  const result = await inspectPageSpeed("https://example.com/about?token=secret#section", async endpoint => {
    requested = new URL(endpoint);
    return new Response(JSON.stringify({ lighthouseResult: { categories: { performance: { score: 0.86 } } } }));
  });
  assert.equal(requested.searchParams.get("url"), "https://example.com/about");
  assert.equal(requested.searchParams.get("strategy"), "mobile");
  assert.equal(result.score, 86);
  assert.equal(result.status, "available");
});

test("external failure and malformed scores remain unavailable", async () => {
  for (const fetcher of [async () => { throw new Error("sensitive detail"); }, async () => new Response("{}")]) {
    const result = await inspectPageSpeed("https://example.com", fetcher);
    assert.equal(result.status, "unavailable");
    assert.equal(result.score, null);
    assert.ok(!result.message.includes("sensitive detail"));
  }
});
