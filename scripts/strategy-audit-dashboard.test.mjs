import test from "node:test";
import assert from "node:assert/strict";
import { rankOpportunities, matchesAuditFilters } from "../src/app/strategy/audit/opportunities.ts";
import { normalizeDraft } from "../src/app/strategy/schema.ts";
test("weak evidence never outranks stronger evidence merely on impact", () => {
  const weak = { confidence: "low", impact: "high", relevance: "high", service: "Website", outreachSuitability: "high", communicationEase: "high" };
  const supported = { confidence: "medium", impact: "low" };
  assert.equal(rankOpportunities([weak, supported])[0], supported);
});
test("saved audit review survives normalization and old drafts remain readable", () => {
  const snapshot = { business: "Example", findings: [{ source: "https://example.com", observation: "Text", recommendation: "Improve", kind: "observed", impact: "high", effort: "low", benefit: "Clarity", verification: "verified", approved: true }], checks: [], sources: [], report: {} };
  assert.deepEqual(normalizeDraft({ auditSnapshot: snapshot }).auditSnapshot, snapshot);
  assert.equal(normalizeDraft({}).auditSnapshot, null);
});

test("platform, impact and verification filters combine and legacy findings need review", () => {
  const finding = { impact: "high" };
  assert.equal(matchesAuditFilters(finding, "Instagram", { platform: "Instagram", impact: "high", verification: "needs_review" }), true);
  assert.equal(matchesAuditFilters(finding, "Instagram", { platform: "Facebook", impact: "high", verification: "needs_review" }), false);
  assert.equal(matchesAuditFilters(finding, "Instagram", { platform: "all", impact: "all", verification: "verified" }), false);
});
test("business fit, impact, service, suitability and communication all contribute within an evidence tier", () => {
  const base = { confidence: "high", relevance: "low", impact: "low", outreachSuitability: "low", communicationEase: "low" };
  for (const field of ["relevance", "impact", "outreachSuitability", "communicationEase"]) assert.equal(rankOpportunities([base, { ...base, [field]: "high" }])[0][field], "high");
  assert.equal(rankOpportunities([base, { ...base, service: "Website" }])[0].service, "Website");
});

test("service relevance affects ranking and rejected findings are excluded", () => {
  const base = { confidence: "high", service: "Website", serviceRelevance: "low" };
  const strong = { ...base, serviceRelevance: "high" };
  assert.deepEqual(rankOpportunities([base, { ...strong, verification: "rejected" }, strong]), [strong, base]);
});
test("saved evidence and service relevance survive normalization", () => {
  const source = { url: "https://example.com", text: "Captured text", metadata: "Page details" };
  const finding = { source: source.url, observation: "Observed", serviceRelevance: "high", evidencePoint: { x: 25, y: 75 } };
  const draft = normalizeDraft({ auditSnapshot: { sources: [source], findings: [finding] }, approvedAuditFindings: [finding] });
  assert.equal(draft.auditSnapshot.sources[0].text, "Captured text");
  assert.deepEqual(draft.auditSnapshot.findings[0].evidencePoint, { x: 25, y: 75 });
  assert.equal(draft.approvedAuditFindings[0].serviceRelevance, "high");
});
