import assert from "node:assert/strict";
import test from "node:test";
import { criteria, scoreChecks } from "../src/app/strategy/audit/scoring.ts";
import { normalizeDraft } from "../src/app/strategy/schema.ts";

const valid = criteria.map(item => ({ id: item.id, status: "met", evidence: "Visible evidence", source: "https://example.com" }));
test("missing evidence and duplicate checks are not assessed", () => {
  const result = scoreChecks([{ ...valid[0], source: "" }, valid[1], valid[1]]);
  assert.equal(result.coverage, 0); assert.equal(result.score, null);
});
test("individual deficiencies reduce the score and insufficient coverage is not scored", () => {
  assert.equal(scoreChecks(valid).score, 100);
  const checks = valid.map(check => check.id === "proof" ? { ...check, status: "needs_work" } : check);
  assert.equal(scoreChecks(checks).score, 95);
  assert.equal(scoreChecks(valid.slice(0, 8)).score, null);
  assert.equal(scoreChecks(valid.map(check => check.id === "action" ? { ...check, status: "partial" } : check)).score, 96);
});
test("old records and saved evidence normalize without losing legacy values", () => {
  const old = normalizeDraft({ goals: "Keep", details: { older: "retained" } });
  assert.deepEqual(old.auditEvidence, []); assert.equal(old.details.older, "retained");
  const next = normalizeDraft({ ...old, auditEvidence: [{ path: "owner/folder/id", url: "https://example.org", checkedAt: "date", kind: "desktop" }] });
  assert.equal(next.auditEvidence[0].url, "https://example.org"); assert.equal(next.goals, "Keep");
});

test("legacy strategy and separate audit and proposal survive normalization", () => {
  const legacy = normalizeDraft({ strategy: "Existing strategy" });
  assert.equal(legacy.strategy, "Existing strategy");
  assert.equal(legacy.proposal, ""); assert.equal(legacy.auditReport, "");
  const draft = normalizeDraft({ ...legacy, proposal: "Proposal text", auditReport: "Audit text" });
  assert.equal(draft.strategy, "Existing strategy"); assert.equal(draft.proposal, "Proposal text"); assert.equal(draft.auditReport, "Audit text");
});

test("approved findings and their source statuses survive saving and reopening", () => {
  const finding = { source: "https://example.com", observation: "Visible heading", recommendation: "Clarify offer", kind: "observed", impact: "high", effort: "low", benefit: "Clarity" };
  const source = { url: finding.source, status: "accessible", message: "Captured", checkedAt: "2026-11-05" };
  const reopened = normalizeDraft(JSON.parse(JSON.stringify(normalizeDraft({ auditReport: "Saved", approvedAuditFindings: [finding], auditSourceStatus: [source] }))));
  assert.deepEqual(reopened.approvedAuditFindings, [finding]);
  assert.deepEqual(reopened.auditSourceStatus, [source]);
  assert.deepEqual(normalizeDraft({ auditReport: "Older audit" }).approvedAuditFindings, []);
});

test("category weights determine evidence coverage", () => {
  assert.equal(scoreChecks(valid.filter(check => !["action", "path", "contact"].includes(check.id))).coverage, 75);
  assert.equal(scoreChecks(valid.filter(check => !["credentials", "proof", "transparency"].includes(check.id))).coverage, 85);
});
