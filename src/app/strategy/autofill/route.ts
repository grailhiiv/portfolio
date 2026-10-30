import { NextResponse } from "next/server";
import { requireAdminUserId, resolveActiveKey, type OpenAIModel } from "@/app/strategy/actions";
import {
  budgetTierOptions,
  getActiveBusinessFields,
  normalizeDraft,
  videoCapacityOptions,
  type Draft,
} from "@/app/strategy/schema";

export const maxDuration = 120;

const VALID_MODELS = new Set<OpenAIModel>(["gpt-6.1-terra"]);

const TOP_LEVEL_FIELD_LABELS: Record<string, string> = {
  location: "Location or Market",
  about: "About the Business",
  differentiator: "What Makes Them Different",
  audience: "Target Audience",
  goals: "Main Goals",
  offerings: "Products or Services",
  challenges: "Marketing Challenges",
  competitors: "Competitors",
  conversionGoal: "Desired Customer Action",
  brandVoice: "Brand Voice",
  techStack: "Website Platform & Tools Used",
  timeline: "Important Dates or Seasons",
  currentAssets: "Existing Audience & Marketing Materials",
  constraints: "Limits or Things to Avoid",
  leadTrigger: "Why Are They Reaching Out Now?",
  quickWin: "Biggest Quick Win",
  baselineKpis: "Current Numbers & Results",
  campaignHistory: "What’s Working & What’s Not",
};

function clean(val: unknown): string {
  return typeof val === "string" ? val.trim() : "";
}

function isSafePublicUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "[::1]" ||
      host.endsWith(".local") ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractUrlsFromText(text: string): string[] {
  const safeText = clean(text);
  if (!safeText) return [];
  const matches = safeText.match(/https?:\/\/[^\s"'<>)\]]+/gi) ?? [];
  return Array.from(new Set(matches.map(u => u.replace(/[.,;!?]+$/, ""))));
}

function stripHtmlToReadableText(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaMatches = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name|property)=["']([^"']+)["'][^>]*?content=["']([^"']+)["'][^>]*?>/gi),
  );
  const metaLines: string[] = [];
  if (titleMatch?.[1]) {
    metaLines.push(`Page Title: ${titleMatch[1].replace(/\s+/g, " ").trim()}`);
  }
  for (const m of metaMatches) {
    const key = m[1]?.toLowerCase() ?? "";
    const val = m[2]?.replace(/\s+/g, " ").trim() ?? "";
    if (val && (key.includes("description") || key.includes("title") || key.includes("site_name"))) {
      metaLines.push(`${m[1]}: ${val}`);
    }
  }

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr|section|article|header|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, 5500);

  return [...metaLines, bodyText].filter(Boolean).join("\n");
}

async function fetchPublicSources(draft: Draft): Promise<string> {
  const websiteRaw = clean(draft.website);
  const candidateUrls = Array.from(
    new Set([
      ...extractUrlsFromText(draft.mainSource),
      ...(websiteRaw
        ? extractUrlsFromText(websiteRaw.startsWith("http") ? websiteRaw : `https://${websiteRaw}`)
        : []),
      ...(draft.profiles ?? []).map(p => clean(p?.url)).filter(Boolean),
    ]),
  )
    .map(isSafePublicUrl)
    .filter((u): u is URL => u !== null)
    .slice(0, 3);

  if (!candidateUrls.length) return "";

  const results = await Promise.all(
    candidateUrls.map(async urlObj => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5500);
      try {
        const res = await fetch(urlObj.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; GrailhiivStrategyBot/1.0)",
            Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
          },
          signal: controller.signal,
        });
        if (!res.ok) return "";
        const raw = await res.text();
        const cleaned = stripHtmlToReadableText(raw);
        return cleaned ? `--- Live Source (${urlObj.toString()}) ---\n${cleaned}` : "";
      } catch {
        return "";
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  return results.filter(Boolean).join("\n\n");
}

function buildExistingContextSummary(draft: Draft, scrapedText: string): string {
  const resolvedType = draft.businessType === "Other" ? clean(draft.businessTypeOther) || "Other" : clean(draft.businessType);
  const activeFields = getActiveBusinessFields(draft.businessType);
  const filledDetails = activeFields
    .map(f => {
      const val = clean(draft.details?.[f.key]);
      return val ? `- ${f.label}: ${val}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const filledTopLevel = Object.entries(TOP_LEVEL_FIELD_LABELS)
    .map(([key, label]) => {
      const val = clean(draft[key as keyof Draft]);
      return val ? `${label}: ${val}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const profilesText = (draft.profiles ?? [])
    .filter(p => clean(p?.platform) || clean(p?.url) || clean(p?.notes))
    .map(
      (p, i) =>
        `Profile ${i + 1}: ${clean(p?.platform) || "Social"}${clean(p?.url) ? ` (${clean(p?.url)})` : ""}${clean(p?.followers) ? ` | ${clean(p?.followers)}` : ""}${clean(p?.cadence) ? ` | ${clean(p?.cadence)}` : ""}${clean(p?.notes) ? `\nNotes: ${clean(p?.notes)}` : ""}`,
    )
    .join("\n\n");

  const findingsText = (draft.findings ?? [])
    .filter(f => clean(f?.observation) || clean(f?.source))
    .map(f => `- ${clean(f?.observation)}${clean(f?.source) ? ` (Source: ${clean(f?.source)})` : ""}`)
    .join("\n");

  return [
    `Strategy Mode: ${draft.mode === "client" ? "Client Strategy (Existing Client)" : "Lead Proposal (Cold Outreach / Prospective Client)"}`,
    `Client Name: ${clean(draft.name) || "Not specified"}`,
    `Business Name: ${clean(draft.business) || "Not specified"}`,
    `Business Type: ${resolvedType || "Not specified"}`,
    `Website: ${clean(draft.website) || "Not specified"}`,
    `Main Source Info / Pasted Notes:\n${clean(draft.mainSource) || "None provided"}`,
    filledDetails ? `Already Filled Business Details:\n${filledDetails}` : "",
    filledTopLevel ? `Already Filled Brief Inputs:\n${filledTopLevel}` : "",
    profilesText ? `Social Profiles:\n${profilesText}` : "",
    findingsText ? `Research Notes:\n${findingsText}` : "",
    scrapedText ? `Extracted Public Webpage Text:\n${scrapedText}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function extractResponseText(payload: {
  output_text?: string;
  output?: { content?: { type?: string; text?: string }[] }[];
}): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }
  return (payload.output ?? [])
    .flatMap(item => item.content ?? [])
    .filter(part => (part.type === "output_text" || part.type === "text") && typeof part.text === "string")
    .map(part => part.text!.trim())
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
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
      targetField?: string;
      model?: string;
    } | null;

    if (!body?.draft || !body.targetField) {
      return NextResponse.json({ error: "Invalid autofill request." }, { status: 400 });
    }

    const draft = normalizeDraft(body.draft);
    const model: OpenAIModel = VALID_MODELS.has(body.model as OpenAIModel) ? (body.model as OpenAIModel) : "gpt-6.1-terra";
    const targetField = clean(body.targetField);

    const hasAnySignal =
      Boolean(clean(draft.mainSource)) ||
      Boolean(clean(draft.website)) ||
      Boolean(clean(draft.business)) ||
      Boolean(clean(draft.name)) ||
      Boolean(clean(draft.about)) ||
      Boolean(clean(draft.businessType)) ||
      (draft.profiles ?? []).some(p => clean(p?.url) || clean(p?.notes)) ||
      (draft.findings ?? []).some(f => clean(f?.observation));

    if (!hasAnySignal) {
      return NextResponse.json(
        { error: "Add at least a Business Type, Business Name, Website, or Quick Source first so AI has context." },
        { status: 400 },
      );
    }

    const scrapedText = await fetchPublicSources(draft);
    const contextSummary = buildExistingContextSummary(draft, scrapedText);
    const activeBusinessFields = getActiveBusinessFields(draft.businessType);

    if (targetField === "all_missing") {
      const missingTopLevel: { key: string; label: string }[] = [];
      for (const [key, label] of Object.entries(TOP_LEVEL_FIELD_LABELS)) {
        if (draft.mode === "lead" && (key === "baselineKpis" || key === "campaignHistory")) continue;
        if (draft.mode === "client" && (key === "leadTrigger" || key === "quickWin")) continue;
        const val = clean(draft[key as keyof Draft]);
        if (!val) missingTopLevel.push({ key, label });
      }

      const missingDetails = activeBusinessFields.filter(f => !clean(draft.details?.[f.key]));

      if (!missingTopLevel.length && !missingDetails.length) {
        return NextResponse.json({ fields: {}, details: {} });
      }

      const schemaDescription = [
        ...missingTopLevel.map(f => `- "field:${f.key}": (${f.label}) Plain-English, concise 1–2 sentence input`),
        ...(clean(draft.videoCapacity) ? [] : [`- "field:videoCapacity": One of ${JSON.stringify(videoCapacityOptions.map(o => o.value).filter(Boolean))} or ""`]),
        ...(clean(draft.budgetTier) ? [] : [`- "field:budgetTier": One of ${JSON.stringify(budgetTierOptions.map(o => o.value).filter(Boolean))} or ""`]),
        ...missingDetails.map(f =>
          f.type === "select" && f.options
            ? `- "detail:${f.key}": (${f.label}) MUST be one of ${JSON.stringify(f.options.map(o => o.value).filter(Boolean))}`
            : `- "detail:${f.key}": (${f.label}) Plain-English concise value`,
        ),
      ].join("\n");

      const systemPrompt = [
        "You are an expert marketing strategist helping fill in blank intake fields for a prospective or active client brief (often for cold outreach where only public links, bios, or basic info are known).",
        "Use the provided context and extracted webpage text to infer realistic, specific, plain-English values for the requested keys.",
        "Rules:",
        "- Return ONLY a valid JSON object mapping each key (e.g. \"field:differentiator\" or \"detail:author_genre\") to its string value.",
        "- Do NOT wrap the JSON in markdown code fences.",
        "- Write in clear, natural, everyday English without consulting jargon.",
        "- Keep single-line fields under 18 words and multi-line fields to 1–3 crisp sentences.",
        "- Never fabricate fake internal revenue numbers; when inferring for cold outreach, frame goals and challenges around observable gaps and realistic industry benchmarks.",
      ].join("\n");

      const userPrompt = `${contextSummary}\n\nGenerate a JSON object with values for these missing keys:\n${schemaDescription}`;

      try {
        const upstream = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeKey}`,
          },
          body: JSON.stringify({
            model,
            reasoning: { effort: "low" },
            input: [
              { role: "developer", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: request.signal,
        });

        if (!upstream.ok) {
          const errPayload = (await upstream.json().catch(() => null)) as { error?: { message?: string } } | null;
          return NextResponse.json(
            { error: errPayload?.error?.message || `Generation failed (${upstream.status}).` },
            { status: upstream.status || 500 },
          );
        }

        const data = (await upstream.json()) as {
          output_text?: string;
          output?: { content?: { type?: string; text?: string }[] }[];
        };
        const rawText = extractResponseText(data)
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed = JSON.parse(rawText) as Record<string, unknown>;
        const fields: Record<string, string> = {};
        const details: Record<string, string> = {};

        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v !== "string" || !v.trim()) continue;
          if (k.startsWith("field:")) {
            fields[k.slice(6)] = v.trim();
          } else if (k.startsWith("detail:")) {
            details[k.slice(7)] = v.trim();
          }
        }

        return NextResponse.json({ fields, details });
      } catch {
        return NextResponse.json({ error: "Could not auto-fill the blank fields. Please try again." }, { status: 500 });
      }
    }

    // Single-field generation
    let fieldLabel = "";
    let placeholderHint = "";
    if (targetField.startsWith("detail:")) {
      const detailKey = targetField.slice(7);
      const spec = activeBusinessFields.find(f => f.key === detailKey);
      fieldLabel = spec?.label || detailKey;
      placeholderHint = spec?.placeholder || "";
    } else {
      fieldLabel = TOP_LEVEL_FIELD_LABELS[targetField] || targetField;
    }

    const systemPrompt = [
      "You are an expert marketing strategist helping fill in a single field on a client brief (often for cold outreach based on limited public info).",
      `Write the value for the field "${fieldLabel}".`,
      "Rules:",
      "- Output ONLY the direct text to place inside the input field (no field label prefix, no quotation marks, no markdown formatting).",
      "- Use clear, plain, everyday English without consulting jargon.",
      "- Be specific to the business and business type provided. Keep it concise (1 sentence for short fields, 2–3 sentences max for textareas).",
      placeholderHint ? `- Style/content reference: ${placeholderHint}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          model,
          reasoning: { effort: "low" },
          input: [
            { role: "developer", content: systemPrompt },
            { role: "user", content: `${contextSummary}\n\nGenerate the value for: ${fieldLabel}` },
          ],
        }),
        signal: request.signal,
      });

      if (!upstream.ok) {
        const errPayload = (await upstream.json().catch(() => null)) as { error?: { message?: string } } | null;
        return NextResponse.json(
          { error: errPayload?.error?.message || `Generation failed (${upstream.status}).` },
          { status: upstream.status || 500 },
        );
      }

      const data = (await upstream.json()) as {
        output_text?: string;
        output?: { content?: { type?: string; text?: string }[] }[];
      };
      const text = extractResponseText(data);
      return NextResponse.json({ value: text });
    } catch {
      return NextResponse.json({ error: `Could not generate "${fieldLabel}". Please try again.` }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not generate field." },
      { status: 500 },
    );
  }
}
