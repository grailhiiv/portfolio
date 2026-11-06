import test from "node:test";
import assert from "node:assert/strict";
import { prepareManualEvidence, screenshotSourceMatches } from "../src/app/strategy/audit/manual-evidence.ts";
import { parseAuditSources } from "../src/app/strategy/source-links.ts";

test("a screenshot cannot silently follow an edited source link", () => {
  assert.equal(screenshotSourceMatches("https://example.com", "https://example.com "), true);
  assert.equal(screenshotSourceMatches("https://example.com", "https://other.example"), false);
  assert.equal(screenshotSourceMatches("https://example.com", ""), false);
  assert.equal(screenshotSourceMatches("", "https://example.com"), false);
});

test("screenshots are associated with their source and unsupplied sources remain unassessed", () => {
  let id = 0;
  const attachments = [{ url: "https://example.com", name: "one.png", dataUrl: "image-1" }, { url: "https://example.com", name: "two.png", dataUrl: "image-2" }, { url: "https://other.example", name: "three.png", dataUrl: "image-3" }];
  const result = prepareManualEvidence(["https://example.com", "https://other.example", "https://unseen.example"], attachments, "2026-01-01", () => String(++id));
  assert.deepEqual(result.sources.map(item => item.images.length), [2, 1, 0]);
  assert.equal(result.sources[2].status, "unavailable");
  assert.deepEqual(result.evidenceUrls, ["https://example.com", "https://other.example"]);
  assert.equal(new Set(result.sources.flatMap(item => item.images.map(image => image.kind))).size, 3);
});
test("explicit Other links stay in Other after reopening even when they resemble websites or supported platforms", () => {
  const fields = parseAuditSources("https://example.com\nhttps://facebook.com/example", ["https://example.com", "https://facebook.com/example"]);
  assert.equal(fields.website, "");
  assert.deepEqual(fields.extra, ["https://example.com", "https://facebook.com/example"]);
});
