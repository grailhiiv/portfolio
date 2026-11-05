export type OpportunityFactors = { confidence?: string; relevance?: string; impact?: string; service?: string; serviceRelevance?: string; outreachSuitability?: string; communicationEase?: string; verification?: string };
const value = (level?: string) => ({ high: 3, medium: 2, low: 1 }[level || ""] || 0);
/** Evidence is a gate, not a promise that AI assessments are verified. */
export function rankOpportunities<T extends OpportunityFactors>(findings: T[]): T[] {
  return findings.filter(f => f.verification !== "rejected").sort((a, b) => {
    const tier = (f: T) => f.verification === "verified" ? 2 : f.confidence === "high" || f.confidence === "medium" ? 1 : 0;
    const factors = (f: T) => value(f.relevance) + value(f.impact) + (f.service ? (f.serviceRelevance ? value(f.serviceRelevance) : 2) : 0) + value(f.outreachSuitability) + value(f.communicationEase);
    return tier(b) - tier(a) || factors(b) - factors(a);
  });
}
export function matchesAuditFilters(finding: { impact?: string; verification?: string }, platform: string, filters: { platform: string; impact: string; verification: string }): boolean {
  return (filters.platform === "all" || platform === filters.platform)
    && (filters.impact === "all" || (finding.impact || "unknown") === filters.impact)
    && (filters.verification === "all" || (finding.verification || "needs_review") === filters.verification);
}
