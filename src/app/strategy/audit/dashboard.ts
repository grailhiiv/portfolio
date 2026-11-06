const str = { type: "string" } as const;
const list = (items: object) => ({ type: "array", items });
const obj = (properties: Record<string, object>) => ({ type: "object", additionalProperties: false, required: Object.keys(properties), properties });
const level = { type: "string", enum: ["high", "medium", "low", "unknown"] };

// The legacy report and findings are retained for existing saves and approval flows.
export const dashboardSchema = obj({
  summary: str,
  goals: list(obj({ role: { type: "string", enum: ["primary", "secondary"] }, goal: str, status: { type: "string", enum: ["Client-confirmed", "Operator-provided", "Possible / inferred", "Unknown"] }, provenance: str, verification: str })),
  strengths: list(obj({ observation: str, sourceId: str })),
  opportunities: list(obj({ title: str, priority: level, confidence: level, observation: str, sourceId: str, goal: str, why: str, action: str, verification: str })),
  channelOpportunities: list(obj({ title: str, relatedOpportunity: str, currentPresence: str, evidenceIds: list(str), goal: str, reason: str, scope: str, existingAlternative: str, conditions: str, priority: { type: "string", enum: ["high", "medium", "low", "undetermined"] }, priorityReason: str })),
  reviews: list(obj({ sourceId: str, scope: str, strengths: str, opportunities: str, notAssessed: str })),
  journey: list(obj({ stage: { type: "string", enum: ["Discovery", "Interest", "Action", "Ongoing connection"] }, observation: str, sourceId: str })),
  direction: str, outreachAngle: str, outreachDraft: str, questions: list(str), handoff: str,
  files: list(obj({ id: str, status: { type: "string", enum: ["reviewed", "partially reviewed", "unreadable"] }, scope: str, limitation: str })),
});

export type Dashboard = {
  summary: string;
  goals: { role: string; goal: string; status: string; provenance: string; verification: string }[];
  strengths: { observation: string; sourceId: string }[];
  opportunities: { title: string; priority: string; confidence: string; observation: string; sourceId: string; goal: string; why: string; action: string; verification: string }[];
  channelOpportunities?: { title: string; relatedOpportunity?: string; currentPresence: string; evidenceIds: string[]; goal: string; reason: string; scope: string; existingAlternative: string; conditions: string; priority: string; priorityReason: string }[];
  reviews: { sourceId: string; scope: string; strengths: string; opportunities: string; notAssessed: string }[];
  journey: { stage: string; observation: string; sourceId: string }[];
  direction: string; outreachAngle: string; outreachDraft: string; questions: string[]; handoff: string;
  files: { id: string; status: string; scope: string; limitation: string }[];
};
export type LedgerEntry = { id: string; name: string; type: string; url: string; status: string; date: string; scope: string; limitation: string };

export function matchingChannelOpportunity(d: Dashboard, item: NonNullable<Dashboard["channelOpportunities"]>[number]) {
  if (item.relatedOpportunity?.trim()) {
    const exact = d.opportunities.find(opportunity => opportunity.title.toLowerCase() === item.relatedOpportunity?.trim().toLowerCase());
    if (exact) return exact;
  }
  const words = (value: string) => new Set(value.toLowerCase().match(/[a-z0-9]+/g)?.filter(word => word.length > 3 && !["review", "check", "consider", "improve", "existing"].includes(word)) || []);
  const title = words(item.title);
  return d.opportunities.find(opportunity => {
      const concepts = [/\b(retailer|retailers|purchase options|purchase route)\b/i, /\b(reader updates?|newsletter|opt-in reader)\b/i, /\b(facebook.{0,40}(?:booking|book now|button)|(?:booking|book now).{0,40}facebook)\b/i];
      if (concepts.some(pattern => pattern.test(item.title) && pattern.test(opportunity.title))) return true;
      const other = words(opportunity.title);
      const shared = [...title].filter(word => other.has(word)).length;
      return shared >= 2 && shared / Math.min(title.size, other.size) >= 0.75;
  });
}

export function additionalChannelOpportunities(d: Dashboard) {
  return (d.channelOpportunities || []).filter(item => !matchingChannelOpportunity(d, item));
}

export function reconcileDashboard(dashboard: Dashboard, ledger: LedgerEntry[]) {
  const assessments = new Map((Array.isArray(dashboard.files) ? dashboard.files : []).map(file => [file.id, file]));
  const entries = ledger.map(entry => {
    if (entry.type !== "Screenshot") return entry;
    const result = assessments.get(entry.id);
    if (!result || !["reviewed", "partially reviewed", "unreadable"].includes(result.status)) return { ...entry, status: "not verified", limitation: "The model did not report whether it could interpret this screenshot." };
    return { ...entry, status: result.status, scope: result.scope || "Not specified", limitation: `${entry.limitation} ${result.limitation || ""}`.trim() };
  });
  const reviewed = new Set(entries.filter(entry => ["reviewed", "partially reviewed"].includes(entry.status)).map(entry => entry.id));
  const sources = new Set(entries.filter(entry => entry.type !== "Screenshot" && entries.some(file => reviewed.has(file.id) && file.url === entry.url)).map(entry => entry.id));
  const allowed = new Set([...reviewed, ...sources]);
  const valid = (id: string) => reviewed.has(id);
  return { ledger: entries, dashboard: {
    ...dashboard,
    strengths: (dashboard.strengths || []).filter(item => valid(item.sourceId)).slice(0, 3),
    opportunities: (dashboard.opportunities || []).filter(item => valid(item.sourceId)).slice(0, 3),
    channelOpportunities: (dashboard.channelOpportunities || []).filter(item => item && Array.isArray(item.evidenceIds) && item.evidenceIds.length > 0 && item.evidenceIds.every(id => id === "INTAKE" || valid(id))).slice(0, 6),
    reviews: (dashboard.reviews || []).filter(item => allowed.has(item.sourceId)),
    journey: (dashboard.journey || []).filter(item => valid(item.sourceId)),
    questions: (dashboard.questions || []).slice(0, 5),
    summary: reviewed.size ? dashboard.summary : "No submitted source was interpreted. Review accessible pages or legible screenshots to establish observations.",
    direction: reviewed.size ? dashboard.direction : "Confirm goals and review source material before choosing a direction.",
    handoff: reviewed.size ? dashboard.handoff : "No source evidence has been interpreted. Confirm goals and supply accessible pages or legible screenshots before assessing opportunities.",
    outreachAngle: reviewed.size ? dashboard.outreachAngle : "",
    outreachDraft: reviewed.size ? dashboard.outreachDraft : "",
  }, reviewedUrls: new Set(entries.filter(entry => reviewed.has(entry.id)).map(entry => entry.url)) };
}

export function formatDashboard(d: Dashboard, ledger: LedgerEntry[], business = "", businessType = ""): string {
  const goals = d.goals.map(g => `${g.role}: ${g.goal} — ${g.status}; ${g.provenance}; ${g.verification}`).join("\n");
  const strengths = d.strengths.map(x => `${x.observation} [${x.sourceId}]`).join("\n");
  const opportunities = d.opportunities.map(x => {
    const related = (d.channelOpportunities || []).filter(channel => matchingChannelOpportunity(d, channel) === x).map(channel => `\nChannel context: ${channel.currentPresence} [${channel.evidenceIds.join(", ")}]\nWhy consider: ${channel.reason}\nSuggested scope: ${channel.scope}\nExisting-channel alternative: ${channel.existingAlternative}\nConditions: ${channel.conditions}\nPriority rationale: ${channel.priorityReason}`).join("");
    return `${x.title} — priority ${x.priority}, confidence ${x.confidence} (judgements)\nObservation: ${x.observation} [${x.sourceId}]\nGoal: ${x.goal}\nWhy it may matter: ${x.why}\nAction: ${x.action}\nVerify: ${x.verification}${related}`;
  }).join("\n\n");
  const reviews = d.reviews.map(x => `[${x.sourceId}] Scope: ${x.scope}\nStrengths: ${x.strengths}\nPossible opportunities: ${x.opportunities}\nNot assessed: ${x.notAssessed}`).join("\n\n");
  const channelOpportunities = additionalChannelOpportunities(d).map(x => `${x.title}\nCurrent presence: ${x.currentPresence} [${x.evidenceIds.join(", ")}]\nGoal: ${x.goal}\nWhy consider: ${x.reason}\nSuggested scope: ${x.scope}\nExisting-channel alternative: ${x.existingAlternative}\nConditions and unknowns: ${x.conditions}\nPriority: ${x.priority} (judgement); ${x.priorityReason}`).join("\n\n");
  const journey = ["Discovery", "Interest", "Action", "Ongoing connection"].map(stage => { const x = d.journey.find(item => item.stage === stage); return `${stage}: ${x ? `${x.observation} [${x.sourceId}]` : "Unknown / not assessed"}`; }).join("\n");
  const sources = ledger.map(x => `[${x.id}] ${x.name} (${x.type}): ${x.status}; ${x.date}\nScope: ${x.scope}\nLimitations: ${x.limitation}`).join("\n");
  return `Overview\nBusiness: ${business || "Unknown"}\nBusiness type: ${businessType || "Unknown"}\n${d.summary}\n${goals || "Goals unknown."}\n\nKey findings\nStrengths:\n${strengths || "None established."}\nOpportunities:\n${opportunities || "None established."}\n\nDetailed audit\n${reviews || "Not assessed."}\n\nChannel opportunities\nINTAKE refers only to provided fields, not a search.\n${channelOpportunities || "None identified; confirm goals and existing channels."}\n\nCustomer journey\n${journey}\nDirection: ${d.direction}\n\nOutreach (unsent draft)\n${d.outreachAngle}\n${d.outreachDraft || "A readable source is needed for personalised outreach."}\n\nNext steps\n${d.questions.join("\n")}\nProposal hand-off: ${d.handoff}\n\nSources reviewed\n${sources}`;
}
