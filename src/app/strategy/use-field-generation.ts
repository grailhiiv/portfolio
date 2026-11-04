"use client";
import {
  useState,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import type { Draft } from "./schema";
import type { OpenAIModel } from "./actions";
import type { WorkspaceData } from "./use-strategy-storage";

export function useFieldGeneration({
  draft,
  model,
  keyConfigured,
  generatingStrategy,
  dataRef,
  patchDraft,
  setStatus,
}: {
  draft: Draft;
  model: OpenAIModel;
  keyConfigured: boolean;
  generatingStrategy: boolean;
  dataRef: RefObject<WorkspaceData>;
  patchDraft: (patch: Partial<Draft>) => void;
  setStatus: Dispatch<SetStateAction<string>>;
}) {
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  async function generateField(targetField: string) {
    if (!keyConfigured) {
      setStatus("Add an OpenAI API key in Settings to generate fields.");
      return;
    }
    if (generatingField || generatingStrategy) return;
    const requestedRecordId = dataRef.current.activeId;
    const requestedDraft = draft;
    setGeneratingField(targetField);
    setStatus("");
    try {
      const res = await fetch("/strategy/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, targetField, model }),
      });
      const payload = (await res.json().catch(() => null)) as {
        error?: string;
        value?: string;
        fields?: Record<string, string>;
        details?: Record<string, string>;
      } | null;
      if (!res.ok || !payload) {
        setStatus(
          payload?.error || `Could not generate field (${res.status}).`,
        );
        return;
      }
      const currentData = dataRef.current;
      if (currentData.activeId !== requestedRecordId) {
        setStatus(
          "The active brief changed while generating. No generated fields were applied.",
        );
        return;
      }
      const latestDraft =
        currentData.records.find((item) => item.id === requestedRecordId)
          ?.draft ?? requestedDraft;
      if (targetField === "all_missing") {
        const mergedFields: Partial<Draft> = {};
        for (const [k, v] of Object.entries(payload.fields ?? {})) {
          if (
            typeof v === "string" &&
            v.trim() &&
            !(latestDraft[k as keyof Draft] as string | undefined)?.trim()
          ) {
            (mergedFields as Record<string, unknown>)[k] = v.trim();
          }
        }
        const mergedDetails = { ...latestDraft.details };
        for (const [k, v] of Object.entries(payload.details ?? {})) {
          if (typeof v === "string" && v.trim() && !mergedDetails[k]?.trim()) {
            mergedDetails[k] = v.trim();
          }
        }
        if (
          Object.keys(mergedFields).length ||
          Object.keys(mergedDetails).some(
            (k) => mergedDetails[k] !== latestDraft.details[k],
          )
        ) {
          patchDraft({ ...mergedFields, details: mergedDetails });
        } else {
          setStatus(
            "No blank fields could be filled from the available information.",
          );
        }
      } else if (typeof payload.value === "string" && payload.value.trim()) {
        if (targetField.startsWith("detail:")) {
          const detailKey = targetField.slice(7);
          if (
            latestDraft.details[detailKey] !== requestedDraft.details[detailKey]
          ) {
            setStatus(
              "This field changed while generating. Your edit was kept.",
            );
            return;
          }
          patchDraft({
            details: {
              ...latestDraft.details,
              [detailKey]: payload.value.trim(),
            },
          });
        } else {
          const field = targetField as keyof Draft;
          if (latestDraft[field] !== requestedDraft[field]) {
            setStatus(
              "This field changed while generating. Your edit was kept.",
            );
            return;
          }
          patchDraft({ [field]: payload.value.trim() });
        }
      } else {
        setStatus(
          "There is not enough information to generate this field. Add more source details and try again.",
        );
      }
    } catch {
      setStatus("Could not generate field content. Please try again.");
    } finally {
      setGeneratingField(null);
    }
  }
  return { generatingField, generateField };
}
