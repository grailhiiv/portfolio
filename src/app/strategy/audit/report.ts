export const reportSections = [
  { key: "overview", label: "Business overview" },
  { key: "presence", label: "Current digital presence" },
  { key: "findings", label: "Audit findings" },
  { key: "opportunities", label: "Key opportunities" },
  { key: "strategy", label: "Recommended strategy" },
  { key: "services", label: "GrailHiiv services" },
  { key: "roadmap", label: "30/60/90-day roadmap" },
  { key: "measurement", label: "KPIs and measurement" },
  { key: "evidence", label: "Evidence and limitations" },
] as const;

export type AuditReport = Record<(typeof reportSections)[number]["key"], string>;

export function formatAuditSections(report: Partial<AuditReport>): string {
  return reportSections.map(({ key, label }) => `${label}\n${report[key]?.trim() || "Not available."}`).join("\n\n");
}
