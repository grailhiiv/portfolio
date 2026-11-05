import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDraft } from "../src/app/strategy/schema.ts";
import { sourceKey, sourcePlatform, mergeSourceProfiles, parseAuditSources, serializeAuditSources } from "../src/app/strategy/source-links.ts";

test("recognizes actual social hosts without matching spoofed domains", () => {
  assert.equal(sourcePlatform("https://www.facebook.com/page"), "Facebook");
  assert.equal(sourcePlatform("https://instagram.com/example"), "Instagram");
  assert.equal(sourcePlatform("https://www.amazon.co.uk/author/example"), "Amazon Author Central");
  assert.equal(sourcePlatform("https://facebook.com.example.org/page"), null);
  assert.equal(sourcePlatform("javascript:alert(1)"), null);
});
test("deduplicates social links while preserving profile details", () => {
  const original = { id: "existing", platform: "Facebook", url: "https://www.facebook.com/page/", notes: "keep", followers: "100" };
  const merged = mergeSourceProfiles("https://m.facebook.com/page?ref=abc\nhttps://instagram.com/name\nhttps://instagram.com/name/", [original]);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged[0], original);
  assert.equal(merged[1].platform, "Instagram");
});
test("preserves distinct Facebook profile ids and old record links", () => {
  assert.notEqual(sourceKey("https://facebook.com/profile.php?id=1"), sourceKey("https://facebook.com/profile.php?id=2"));
  const legacy = { website: "https://example.com", profiles: [{ id: "a", platform: "X", url: "https://x.com/example", notes: "" }] };
  assert.equal(normalizeDraft(legacy).auditSources, "https://example.com\nhttps://x.com/example");
  assert.equal(normalizeDraft({ ...legacy, auditSources: "" }).auditSources, "");
});

test("audit intake preserves website, all six platforms, and extra legacy links", () => {
  const links = ["https://example.com", "https://facebook.com/page", "https://instagram.com/name", "https://tiktok.com/@name", "https://linkedin.com/company/example", "https://amazon.com/author/example", "https://youtube.com/@example", "https://x.com/example"];
  const fields = parseAuditSources(links.join("\n"));
  assert.equal(fields.website, links[0]);
  assert.equal(fields.profiles.Instagram, links[2]);
  assert.equal(fields.profiles["Amazon Author Central"], links[5]);
  assert.deepEqual(fields.extra, [links[7]]);
  assert.deepEqual(serializeAuditSources(fields).split("\n"), links);
});
test("multiple saved links on one platform remain available", () => {
  const fields = parseAuditSources("https://instagram.com/one\nhttps://instagram.com/two");
  assert.equal(fields.profiles.Instagram, "https://instagram.com/one");
  assert.deepEqual(fields.extra, ["https://instagram.com/two"]);
});
