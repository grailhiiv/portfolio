import { NextResponse } from "next/server";
import { requireAdminUserId, resolveActiveKey, type OpenAIModel, type ReasoningEffort } from "@/app/strategy/actions";
import { getActiveBusinessFields, normalizeDraft, type Draft } from "@/app/strategy/schema";

export const maxDuration = 300;

const VALID_MODELS = new Set<OpenAIModel>(["gpt-6.1-terra"]);
const VALID_EFFORTS = new Set<ReasoningEffort>(["low", "medium", "high", "xhigh", "max"]);

export async function POST(request: Request) {
  let userId: string;
  try {
    userId = await requireAdminUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { activeKey } = await resolveActiveKey(userId);
  if (!activeKey) {
    return NextResponse.json(
      { error: "No OpenAI API key is configured. Add your API key in Settings first." },
      { status: 400 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    draft?: Partial<Draft>;
    model?: string;
    reasoningEffort?: string;
  } | null;

  if (!body?.draft) {
    return NextResponse.json({ error: "Invalid strategy draft payload." }, { status: 400 });
  }

  const draft = normalizeDraft(body.draft);

  const model: OpenAIModel = VALID_MODELS.has(body.model as OpenAIModel) ? (body.model as OpenAIModel) : "gpt-6.1-terra";
  const effort: ReasoningEffort = VALID_EFFORTS.has(body.reasoningEffort as ReasoningEffort)
    ? (body.reasoningEffort as ReasoningEffort)
    : "medium";

  const resolvedBusinessType = draft.businessType === "Other" ? draft.businessTypeOther || "Other" : draft.businessType;
  const activeBusinessFields = getActiveBusinessFields(draft.businessType);
  const nicheDetailsSection = activeBusinessFields
    .map(field => {
      const value = draft.details[field.key]?.trim();
      return value ? `- ${field.label}: ${value}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const profilesSection = draft.profiles?.length
    ? draft.profiles
        .map((p, i) => {
          const meta = [
            p.status ? `Status: ${p.status}` : "",
            p.followers ? `Audience: ${p.followers}` : "",
            p.cadence ? `Cadence: ${p.cadence}` : "",
          ]
            .filter(Boolean)
            .join(" | ");
          return [
            `Profile ${i + 1}: ${p.platform || "Unspecified"}${p.url ? ` (${p.url})` : ""}`,
            meta ? `Baseline: ${meta}` : "",
            p.notes.trim() ? `Notes: ${p.notes.trim()}` : "",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n")
    : "None provided.";

  const findingsSection = draft.findings?.length
    ? draft.findings
        .filter(f => f.observation.trim() || f.source.trim())
        .map(
          (f, i) =>
            `Finding ${i + 1}${f.category ? ` [${f.category}]` : ""}${f.status ? ` [${f.status}]` : ""}${f.source ? ` — Source: ${f.source}` : ""}${f.date ? ` (${f.date})` : ""}:\n${f.observation.trim()}`,
        )
        .join("\n\n")
    : "None provided.";

  const modeContextSection =
    draft.mode === "lead"
      ? [
          `Lead Trigger / Why Now: ${draft.leadTrigger.trim() || "Not specified"}`,
          `Priority Quick-Win Opportunity:\n${draft.quickWin.trim() || "Not specified"}`,
        ].join("\n\n")
      : [
          `Current Active Package: ${draft.activePackage.trim() || "Not specified"}`,
          `Current Baseline KPIs: ${draft.baselineKpis.trim() || "Not specified"}`,
          `What Worked & What Stalled (Mid-Campaign History):\n${draft.campaignHistory.trim() || "Not specified"}`,
        ].join("\n\n");

  const modeFrameworkGuidance =
    draft.mode === "lead"
      ? [
          "Document Mode: Lead Proposal (Prospective Client Pitch).",
          "Focus internal diagnostics on NOISE, PESTLE, and SWOT to evaluate the baseline and scope the pitch:",
          "- NOISE (Pre-Pitch Social Media Audit): Identify what the brand is missing (Needs), areas for growth (Opportunities), processes to fix (Improvements), current successes (Strengths), and known limitations (Exceptions — grounded in Constraints, Video Capacity, and Budget Tier).",
          "- PESTLE (Macro-Environmental Urgency): Analyse macro-environmental factors specific to their Geographic Market, Business Type, and Niche Details—such as shifting cultural/reader trends, platform algorithm shifts, emerging AI tools, and regulatory/privacy rules—to establish immediate market urgency.",
          "- SWOT (Competitive Baseline): Evaluate the prospect's baseline position against named Competitors, leveraging their Key Differentiator and Existing Assets.",
          "- SOAR (Persuasive Pitch Narrative in Section 7): Translate these internal findings into a persuasive SOAR pitch narrative in plain English, validating Strengths and Opportunities while focusing on what the organisation wants to build (Aspirations) and the key performance indicators required to track success (Results).",
        ].join("\n")
      : [
          "Document Mode: Client Strategy (Existing Client Execution Plan).",
          "Focus internal diagnostics on NOISE and the TOWS Matrix to manage campaign operations and adapt to changes:",
          "- NOISE (Mid-Campaign Systems Audit): Audit active systems mid-campaign using Current Baseline KPIs and Campaign History, identifying missing elements (Needs), growth levers (Opportunities), operational bottlenecks (Improvements), current successes (Strengths), and known limitations (Exceptions).",
          "- TOWS Matrix (Tactical Pivots): Cross-reference internal and external data to generate concrete tactical pivots (SO: Maxi-Maxi, WO: Mini-Maxi, ST: Maxi-Mini, WT: Mini-Mini), turning stalled formats or platform headwinds into actionable pivots.",
          "- SOAR (Ongoing Alignment Narrative in Section 7): Map these operational insights to an ongoing SOAR alignment narrative in plain English for quarterly reviews to define the next phase of community aspirations and results.",
        ].join("\n");

  const internalFrameworksSection =
    draft.mode === "lead"
      ? [
          "5. Internal Diagnostic Frameworks (For Strategist Use Only — evaluate the baseline and scope the pitch):",
          "   - NOISE Analysis (Needs, Opportunities, Improvements, Strengths, Exceptions)",
          "   - PESTLE Analysis (Political, Economic, Social, Technological, Legal, Environmental)",
          "   - SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats against competitors)",
        ].join("\n")
      : [
          "5. Internal Diagnostic Frameworks (For Strategist Use Only — manage campaign operations and generate tactical pivots):",
          "   - NOISE Analysis (Needs, Opportunities, Improvements, Strengths, Exceptions)",
          "   - TOWS Matrix (SO: Maxi-Maxi, WO: Mini-Maxi, ST: Maxi-Mini, WT: Mini-Mini tactical pivots)",
        ].join("\n");

  const systemPrompt = [
    "You are an elite digital, brand, and social media strategist. Write the complete, actionable strategy—cleanly separating the internal diagnostic & execution playbook for the strategist from the plain-English narrative to present to the prospect or client.",
    "",
    modeFrameworkGuidance,
    "",
    "Format the output as clean plain text with clear section headings (no markdown code fences). Keep each section sharp, concrete, and concise (2–4 high-impact bullets per sub-item) so the strategy is immediately scannable and actionable:",
    "",
    "1. Title Line (<Lead Proposal or Client Strategy> — <Business or Client Name>)",
    "2. Objective",
    "3. Audience",
    "4. Opportunities",
    internalFrameworksSection,
    "6. Strategy to Apply (Internal Execution Playbook — built from the Section 5 diagnostics and tailored to the Niche Details, Brand Voice, and Video Capacity: core positioning angle, channel-by-channel plan, content pillars, cadence, conversion mechanics, and priority quick wins)",
    "7. What to Tell the Client (Client-Facing Narrative via SOAR in Plain English — translate the Section 5 internal diagnostic insights into plain, non-defensive English without consulting jargon or raw 'Weaknesses/Threats' labels):",
    "   - Strengths (What’s Already Working): Validate their current foundation so the conversation starts on common ground.",
    "   - Opportunities (Where the Untapped Growth Is): Reframe internal diagnostic gaps and market insights into positive, high-leverage growth openings.",
    "   - Aspirations (Where We Are Taking the Brand): Focus on what the organisation wants to build and the next phase of community and brand growth.",
    "   - Results (What Success Looks Like): Define the key performance indicators, conversion targets, and 30/60/90-day outcomes required to track success.",
    "8. Recommended Services (Select ONLY from the agency's official /pricing catalog below — recommend the best-fit monthly package and any relevant add-ons, state the starting price and included deliverables, and tie each recommendation directly to the Section 5 diagnostics, Target Budget Tier, Video Capacity, Website CMS / Tech Stack, and Conversion Goal):",
    "   Monthly Social Media Management Packages:",
    "   - Essentials (From $650 USD / month): 12 original content pieces/month, up to 2 social profiles, initial strategy & monthly content planning, branded graphics & captions, scheduling & publishing, routine community management (up to 2 hrs/month), monthly performance report with recommendations, 1 round of revisions per monthly batch.",
    "   - Growth (From $1,100 USD / month): 20 original content pieces/month (including up to 4 short videos from client-provided footage), up to 3 social profiles, initial strategy & monthly content planning, branded graphics & captions, scheduling & publishing, routine community management (up to 3 hrs/month), monthly performance report, one 30-minute strategy call/month, 1 round of revisions per monthly batch.",
    "   - Complete (From $1,750 USD / month): 24 original content pieces/month (including up to 6 short videos from client-provided footage), up to 3 social profiles, initial strategy & monthly content planning, branded graphics & captions, scheduling & publishing, routine community management (up to 4 hrs/month), monthly performance report, one 30-minute strategy call/month, 1 round of revisions per monthly batch, Website Care for 1 existing WordPress site (up to 2 hrs/month), plus minor maintenance for 1 existing CRM and 1 existing automation workflow (up to 2 hrs/month combined).",
    "   Add-on Services:",
    "   - Website Care (From $250 USD / month): Routine updates, backup checks, and small content changes for 1 existing WordPress site (up to 2 hrs/month).",
    "   - SEO Audit (From $450 USD / project): Technical and on-page review of 1 website, prioritized findings report, and practical recommendations (implementation quoted separately).",
    "   - CRM Setup (From $600 USD / project): Configuration of 1 CRM, 1 pipeline, and a basic workflow to organize customer information and sales process.",
    "   - Automation Build (From $750 USD / project): 1 workflow connecting up to 2 existing tools to save time on repeat tasks.",
    "   Scope Rules: One content piece = 1 original post, carousel, or short video (up to 60s, edited from client-provided footage); adapted cross-posts count as 1 piece. Ad spend, software subscriptions, hosting, and paid licenses are separate. Never invent packages or prices outside this catalog (if custom scope is needed beyond these limits, note that it is quoted separately).",
    "9. 30 / 60 / 90 Day Roadmap (Days 1–30, Days 31–60, Days 61–90 — aligned with any Key Dates or Launch Windows)",
    "10. Measurement (Baseline metrics, leading indicators, conversion KPIs)",
    "",
    "Rules: Ground every insight in the provided brief, dynamic niche details, social profiles, and research findings. Never invent fake metrics; distinguish hypotheses from observed findings.",
  ].join("\n");

  const userPrompt = [
    `Strategy Mode: ${draft.mode === "client" ? "Client Strategy (Existing Client)" : "Lead Proposal (Prospective Client)"}`,
    `Client Name: ${draft.name.trim() || "Not specified"}`,
    `Business Name: ${draft.business.trim() || "Not specified"}`,
    `Business Type: ${resolvedBusinessType.trim() || "Not specified"}`,
    `Main Source / Pasted Context:\n${draft.mainSource?.trim() || "Not specified"}`,
    `Industry / Niche Details:\n${nicheDetailsSection || "None specified."}`,
    `Geographic Market / Location: ${draft.location.trim() || "Not specified"}`,
    `Website: ${draft.website.trim() || "Not specified"}`,
    `About the Business:\n${draft.about.trim() || "Not specified"}`,
    `Key Differentiator / UVP:\n${draft.differentiator.trim() || "Not specified"}`,
    `Brand Voice & Tone: ${draft.brandVoice.trim() || "Not specified"}`,
    `Target Audience:\n${draft.audience.trim() || "Not specified"}`,
    `Primary Goals:\n${draft.goals.trim() || "Not specified"}`,
    `Products / Services:\n${draft.offerings.trim() || "Not specified"}`,
    `Marketing Challenges:\n${draft.challenges.trim() || "Not specified"}`,
    `Competitors & Benchmarks:\n${draft.competitors.trim() || "Not specified"}`,
    `Conversion Goal: ${draft.conversionGoal.trim() || "Not specified"}`,
    `Video & Content Capacity: ${draft.videoCapacity.trim() || "Not specified"}`,
    `Target Budget / Package Tier: ${draft.budgetTier.trim() || "Not specified"}`,
    `Website CMS, CRM & Active Tools: ${draft.techStack.trim() || "Not specified"}`,
    `Key Dates, Launch Window or Seasonality: ${draft.timeline.trim() || "Not specified"}`,
    `Existing Marketing Assets & List Size: ${draft.currentAssets.trim() || "Not specified"}`,
    `Constraints, Exceptions & Boundaries:\n${draft.constraints.trim() || "Not specified"}`,
    modeContextSection,
    `Social Profiles:\n${profilesSection}`,
    `Research Findings:\n${findingsSection}`,
  ].join("\n\n");

  let upstream: Response;
  try {
    upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey}`,
      },
      body: JSON.stringify({
        model,
        reasoning: { effort },
        stream: true,
        input: [
          { role: "developer", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: request.signal,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach OpenAI. Check your network connection or API key and try again." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    const errPayload = (await upstream.json().catch(() => null)) as { error?: { message?: string } } | null;
    const message = errPayload?.error?.message || `OpenAI request failed (${upstream.status}).`;
    return NextResponse.json({ error: message }, { status: upstream.status || 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  function sendPacket(controller: ReadableStreamDefaultController<Uint8Array>, packet: Record<string, unknown>) {
    controller.enqueue(encoder.encode(`${JSON.stringify(packet)}\n`));
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let emittedText = false;
      sendPacket(controller, { type: "status", phase: "thinking" });
      const heartbeat = setInterval(() => {
        try {
          sendPacket(controller, { type: "ping" });
        } catch {
          clearInterval(heartbeat);
        }
      }, 2000);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const dataStr = line.slice(5).trim();
            if (!dataStr || dataStr === "[DONE]") continue;
            try {
              const event = JSON.parse(dataStr) as {
                type?: string;
                delta?: string;
                text?: string;
                response?: {
                  output_text?: string;
                  output?: { content?: { type?: string; text?: string }[] }[];
                  error?: { message?: string };
                };
                error?: { message?: string };
              };
              if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
                emittedText = true;
                sendPacket(controller, { type: "delta", text: event.delta });
              } else if (event.type === "response.completed" && !emittedText && event.response) {
                const fallbackText =
                  event.response.output_text ||
                  (event.response.output ?? [])
                    .flatMap(item => item.content ?? [])
                    .filter(part => (part.type === "output_text" || part.type === "text") && typeof part.text === "string")
                    .map(part => part.text!)
                    .join("\n\n");
                if (fallbackText) {
                  emittedText = true;
                  sendPacket(controller, { type: "delta", text: fallbackText });
                }
              } else if (event.type === "error" || event.type === "response.failed") {
                const errMsg = event.error?.message || event.response?.error?.message || "OpenAI generation failed.";
                sendPacket(controller, { type: "error", message: errMsg });
              }
            } catch {
              // Ignore partial JSON lines
            }
          }
        }
        sendPacket(controller, { type: "done" });
      } catch {
        // Stream aborted or disconnected
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
    cancel() {
      void reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
