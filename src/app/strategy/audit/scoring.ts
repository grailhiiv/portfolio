export const categories = ["Positioning", "Content", "Discoverability", "Conversion", "Trust"] as const;
export const weights: Record<(typeof categories)[number], number> = { Positioning: 20, Content: 20, Discoverability: 20, Conversion: 25, Trust: 15 };
export const criteria = [
  { id: "identity", category: "Positioning", label: "Business identity is clear" },
  { id: "audience", category: "Positioning", label: "Intended audience is clear" },
  { id: "offer", category: "Positioning", label: "Offer and value are clear" },
  { id: "relevance", category: "Content", label: "Content is relevant and useful" },
  { id: "specificity", category: "Content", label: "Content explains services or products specifically" },
  { id: "journey", category: "Content", label: "Content supports the visitor journey" },
  { id: "title", category: "Discoverability", label: "Page or profile identifies the business" },
  { id: "navigation", category: "Discoverability", label: "Key information is easy to locate" },
  { id: "mobile", category: "Discoverability", label: "Visible mobile presentation supports navigation" },
  { id: "action", category: "Conversion", label: "A clear next action is visible" },
  { id: "path", category: "Conversion", label: "The next step is easy to find and understand" },
  { id: "contact", category: "Conversion", label: "A relevant contact, booking, or purchase option is visible" },
  { id: "credentials", category: "Trust", label: "Relevant credentials or experience are visible" },
  { id: "proof", category: "Trust", label: "Specific evidence supports claims" },
  { id: "transparency", category: "Trust", label: "Business and contact details are transparent" },
] as const;
export type Check = { id: string; status: string; evidence: string; source: string };
/** A fixed rubric over individually evidenced checks; missing and duplicated checks never earn points. */
export function scoreChecks(checks: Check[]) {
  const details = criteria.map(criterion => {
    const matches = checks.filter(check => check.id === criterion.id);
    const check = matches.length === 1 ? matches[0] : undefined;
    const usable = !!check?.evidence?.trim() && !!check?.source?.trim();
    const score = !usable ? null : check?.status === "met" ? 100 : check?.status === "partial" ? 50 : check?.status === "needs_work" ? 0 : null;
    return { ...criterion, score, status: score === null ? "not_assessed" : check!.status, evidence: score === null ? "Insufficient evidence." : check!.evidence, source: score === null ? "" : check!.source };
  });
  const rows = categories.map(category => {
    const items = details.filter(item => item.category === category);
    const assessed = items.filter(item => item.score !== null);
    const score = assessed.length ? Math.round(assessed.reduce((sum, item) => sum + item.score!, 0) / assessed.length) : null;
    return { category, weight: weights[category], score, assessed: assessed.length, total: items.length, items };
  });
  const coverageValue = rows.reduce((sum, row) => sum + row.weight * row.assessed / row.total, 0);
  const weighted = rows.reduce((sum, row) => sum + row.items.reduce((subtotal, item) => subtotal + (item.score ?? 0) * row.weight / row.total, 0), 0);
  return { rows, details, coverage: Math.round(coverageValue), score: coverageValue >= 80 ? Math.round(weighted / coverageValue) : null };
}
