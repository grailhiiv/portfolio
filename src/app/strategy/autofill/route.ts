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

import { TOP_LEVEL_FIELD_LABELS, EVIDENCE_RULES, clean, buildExistingContextSummary } from "./evidence";
import { fetchPublicSources } from "./sources";
import { extractResponseText } from "./response";
import { requestCompletion } from "./openai";

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

      if (!missingTopLevel.length && !missingDetails.length && clean(draft.videoCapacity) && clean(draft.budgetTier)) {
        return NextResponse.json({ fields: {}, details: {} });
      }

      const schemaDescription = [
        ...missingTopLevel.map(f => `- "field:${f.key}": (${f.label}) Plain-English, concise 1–2 sentence input`),
        ...(clean(draft.videoCapacity) ? [] : [`- "field:videoCapacity": One of ${JSON.stringify(videoCapacityOptions.map(o => o.value).filter(Boolean))} or ""`]),
        ...(clean(draft.budgetTier) ? [] : [`- "field:budgetTier": One of ${JSON.stringify(budgetTierOptions.map(o => o.value).filter(Boolean))} or ""`]),
        ...missingDetails.map(f =>
          f.type === "select" && f.options
            ? `- "detail:${f.key}": (${f.label}) One of ${JSON.stringify(f.options.map(o => o.value).filter(Boolean))} or ""`
            : `- "detail:${f.key}": (${f.label}) Plain-English concise value`,
        ),
      ].join("\n");

      const systemPrompt = [
        "You are an expert marketing strategist helping fill in blank intake fields for a prospective or active client brief (often for cold outreach where only public links, bios, or basic info are known).",
        "Use the provided context to fill only supported values for the requested keys.",
        EVIDENCE_RULES,
        "Rules:",
        "- Return ONLY a valid JSON object mapping each key (e.g. \"field:differentiator\" or \"detail:author_genre\") to its string value.",
        "- Do NOT wrap the JSON in markdown code fences.",
        "- Write in clear, natural, everyday English without consulting jargon.",
        "- Keep single-line fields under 18 words and multi-line fields to 1–3 crisp sentences.",
        "- Return an empty string for any key without enough evidence; do not force a value or invent benchmarks.",
      ].join("\n");

      const userPrompt = `${contextSummary}\n\nGenerate a JSON object with values for these missing keys:\n${schemaDescription}`;

      try {
        const upstream = await requestCompletion(activeKey, model, systemPrompt, userPrompt, request.signal);

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
        const allowedFields = new Set(missingTopLevel.map(f => f.key));
        if (!clean(draft.videoCapacity)) allowedFields.add("videoCapacity");
        if (!clean(draft.budgetTier)) allowedFields.add("budgetTier");
        const allowedDetails = new Map(missingDetails.map(f => [f.key, f]));

        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v !== "string" || !v.trim()) continue;
          if (k.startsWith("field:")) {
            const key = k.slice(6);
            if (!allowedFields.has(key)) continue;
            if (key === "videoCapacity" && !videoCapacityOptions.some(o => o.value === v.trim())) continue;
            if (key === "budgetTier" && !budgetTierOptions.some(o => o.value === v.trim())) continue;
            fields[key] = v.trim();
          } else if (k.startsWith("detail:")) {
            const key = k.slice(7);
            const spec = allowedDetails.get(key);
            if (!spec || (spec.type === "select" && !spec.options?.some(o => o.value === v.trim()))) continue;
            details[key] = v.trim();
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

    if (targetField.startsWith("detail:") ? !activeBusinessFields.some(f => f.key === targetField.slice(7) && f.type !== "select") : !Object.hasOwn(TOP_LEVEL_FIELD_LABELS, targetField)) {
      return NextResponse.json({ error: "Invalid field." }, { status: 400 });
    }

    const systemPrompt = [
      "You are an expert marketing strategist helping fill in a single field on a client brief (often for cold outreach based on limited public info).",
      `Write the value for the field "${fieldLabel}".`,
      EVIDENCE_RULES,
      "Rules:",
      "- Output ONLY the direct text to place inside the input field (no field label prefix, no quotation marks, no markdown formatting).",
      "- Use clear, plain, everyday English without consulting jargon.",
      "- Be specific to the business and business type provided. Keep it concise (1 sentence for short fields, 2–3 sentences max for textareas).",
      "- If there is insufficient evidence, output exactly NO_SUPPORTED_VALUE and nothing else. Do not use placeholders as facts.",
      placeholderHint ? `- Style/content reference: ${placeholderHint}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const upstream = await requestCompletion(activeKey, model, systemPrompt, `${contextSummary}\n\nGenerate the value for: ${fieldLabel}`, request.signal);

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
      return NextResponse.json({ value: text === "NO_SUPPORTED_VALUE" ? "" : text });
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
