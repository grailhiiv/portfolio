import assert from 'node:assert/strict';
import test from 'node:test';
import { reportSections, formatAuditSections } from '../src/app/strategy/audit/report.ts';

test('audit report retains all requested sections and explicit missing evidence', () => {
  const report = Object.fromEntries(reportSections.map(section => [section.key, `${section.label} evidence`]));
  const formatted = formatAuditSections(report);
  for (const section of reportSections) assert.match(formatted, new RegExp(section.label));
  assert.equal(reportSections.length, 9);
  assert.match(formatAuditSections({}), /Not available/);
});
