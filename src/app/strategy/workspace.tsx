"use client";

import { useEffect, useRef, useState } from "react";
import { logout } from "../login/actions";
import { removeOpenAIKey, saveOpenAIKey, saveOpenAIPreferences, type OpenAIModel, type ReasoningEffort } from "./actions";
import { deleteAttachments, readAttachments } from "./profile-attachments";
import CloudAttachments from "./cloud-attachments";
import { listRecords, saveRecord, removeRecords, uploadAttachment, deleteProfileCloud, listAttachments, type CloudRecord } from "./cloud";
import DatePicker from "./date-picker";
import CustomSelect from "./custom-select";
import ConfirmOutline from "./confirm-outline";
import ConfirmDelete from "./confirm-delete";
import {
  activePackageOptions,
  budgetTierOptions,
  businessTypes,
  emptyDraft,
  findingCategories,
  getActiveBusinessFields,
  getPlaceholders,
  normalizeDraft,
  profileStatuses,
  socialPlatforms,
  videoCapacityOptions,
  type Draft,
  type Finding,
  type Profile,
} from "./schema";

const empty: Draft = emptyDraft;
const legacyKey = "grailhiiv-strategy-draft-v1";
const key = "grailhiiv-strategy-records-v2";
type RecordEntry = { id: string; updatedAt: string; draft: Draft };
type WorkspaceData = { version: 2; activeId: string | null; records: RecordEntry[] };

function formatBusinessTypeLabel(type: string): string {
  return type.replace(/\b[a-z]/g, (letter, index) =>
    index === 0 || !/^(and|or)$/.test(type.slice(index).split(" ")[0]) ? letter.toUpperCase() : letter,
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path className="spark-star-main" d="M10.5 2.5C11.1 7.2 12.8 8.9 17.5 9.5C12.8 10.1 11.1 11.8 10.5 16.5C9.9 11.8 8.2 10.1 3.5 9.5C8.2 8.9 9.9 7.2 10.5 2.5Z" />
      <path className="spark-star-top" d="M18.5 2C18.8 4.1 19.6 4.9 21.7 5.2C19.6 5.5 18.8 6.3 18.5 8.4C18.2 6.3 17.4 5.5 15.3 5.2C17.4 4.9 18.2 4.1 18.5 2Z" />
      <path className="spark-star-bottom" d="M17.5 14C17.8 16.1 18.6 16.9 20.7 17.2C18.6 17.5 17.8 18.3 17.5 20.4C17.2 18.3 16.4 17.5 14.3 17.2C16.4 16.9 17.2 16.1 17.5 14Z" />
    </svg>
  );
}

export default function StrategyWorkspace({ ownerId, openAIConfigured, hasCustomOpenAIKey = false, maskedOpenAIKey = null, initialModel = "gpt-6.1-terra", initialReasoningEffort = "medium", initialRecords = null }: { ownerId: string; openAIConfigured: boolean; hasCustomOpenAIKey?: boolean; maskedOpenAIKey?: string | null; initialModel?: OpenAIModel; initialReasoningEffort?: ReasoningEffort; initialRecords?: CloudRecord[] | null }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmOutline, setConfirmOutline] = useState(false);
  const [view, setView] = useState<"workspace" | "history" | "settings">("workspace");
  const [keyConfigured, setKeyConfigured] = useState(openAIConfigured);
  const [customKeySaved, setCustomKeySaved] = useState(hasCustomOpenAIKey);
  const [maskedKey, setMaskedKey] = useState<string | null>(maskedOpenAIKey);
  const [model, setModel] = useState<OpenAIModel>(initialModel);
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(initialReasoningEffort);
  const [savedModel, setSavedModel] = useState<OpenAIModel>(initialModel);
  const [savedReasoningEffort, setSavedReasoningEffort] = useState<ReasoningEffort>(initialReasoningEffort);
  const [prefsBusy, setPrefsBusy] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState("");
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState<"thinking" | "writing">("thinking");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyMessage, setKeyMessage] = useState("");
  const [data, setData] = useState<WorkspaceData>({ version: 2, activeId: null, records: [] });
  const dataRef = useRef(data);
  const [deleteTarget, setDeleteTarget] = useState<string | "all" | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const pendingRecordsRef = useRef<Map<string, RecordEntry>>(new Map());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyKey = `grailhiiv-unsynced-${ownerId}`;

  function flushSaves(): Promise<void> {
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const batch = Array.from(pendingRecordsRef.current.values());
    pendingRecordsRef.current.clear();
    if (!batch.length) return saveQueue.current;
    saveQueue.current = saveQueue.current.catch(() => {}).then(async () => {
      let failed = false;
      for (const record of batch) {
        try {
          await saveRecord(ownerId, record);
          const pending = JSON.parse(localStorage.getItem(dirtyKey) || "{}") as Record<string, string>;
          if (pending[record.id] === record.updatedAt) {
            delete pending[record.id];
            localStorage.setItem(dirtyKey, JSON.stringify(pending));
          }
        } catch {
          failed = true;
        }
      }
      if (failed) {
        setStatus("Could not save to Supabase. Your browser backup remains available; retry by editing the record again.");
      } else {
        const pending = JSON.parse(localStorage.getItem(dirtyKey) || "{}") as Record<string, string>;
        if (!Object.keys(pending).length) setStatus("");
      }
    });
    return saveQueue.current;
  }

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") void flushSaves(); };
    const onPageHide = () => { void flushSaves(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current);
      void flushSaves();
    };
  }, []);

  useEffect(() => {
    if (!generatingStrategy) {
      setElapsedSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [generatingStrategy]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const marker = `grailhiiv-supabase-migrated-${ownerId}`;
        let records = initialRecords ?? await listRecords();
        let saved = localStorage.getItem(key);
        const legacy = localStorage.getItem(legacyKey);
        if (!saved && legacy && !localStorage.getItem(marker)) {
          const values = JSON.parse(legacy) as Record<string, unknown>;
          if (!values || typeof values !== "object" || Array.isArray(values)) throw new Error("Invalid legacy draft");
          const profiles = Array.isArray(values.profiles) ? (values.profiles as Profile[]) : [];
          const findings = Array.isArray(values.findings)
            ? (values.findings as Finding[])
            : values.source || values.research
              ? [{ id: crypto.randomUUID(), source: typeof values.source === "string" ? values.source : "", date: "", observation: typeof values.research === "string" ? values.research : "", status: "", category: "" }]
              : [];
          const id = crypto.randomUUID();
          const migratedDraft = normalizeDraft({ ...(values as Partial<Draft>), profiles, findings });
          saved = JSON.stringify({ version: 2, activeId: id, records: [{ id, updatedAt: new Date().toISOString(), draft: migratedDraft }] });
          localStorage.setItem(key, saved);
        }
        const rawDirty = localStorage.getItem(dirtyKey);
        if (saved && rawDirty && rawDirty !== "{}") {
          const backup = JSON.parse(saved) as WorkspaceData;
          const dirtyMap = JSON.parse(rawDirty) as Record<string, string>;
          const remoteTyped = records.map(record => ({ ...record, draft: normalizeDraft(record.draft as Partial<Draft>) }));
          const mergedMap = new Map<string, RecordEntry>(remoteTyped.map(record => [record.id, record]));
          for (const localRecord of backup.records ?? []) {
            const normalized: RecordEntry = { ...localRecord, draft: normalizeDraft(localRecord.draft) };
            const remoteRecord = mergedMap.get(localRecord.id);
            if (!remoteRecord || dirtyMap[localRecord.id] || localRecord.updatedAt >= remoteRecord.updatedAt) {
              mergedMap.set(localRecord.id, normalized);
            }
          }
          const mergedRecords = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          let syncFailed = false;
          for (const id of Object.keys(dirtyMap)) {
            const record = mergedMap.get(id);
            if (!record) {
              delete dirtyMap[id];
              continue;
            }
            try {
              await saveRecord(ownerId, record);
              delete dirtyMap[id];
            } catch {
              syncFailed = true;
            }
          }
          localStorage.setItem(dirtyKey, JSON.stringify(dirtyMap));
          if (!active) return;
          const activeId = backup.activeId && mergedMap.has(backup.activeId) ? backup.activeId : mergedRecords[0]?.id ?? null;
          const reconciled: WorkspaceData = { version: 2, activeId, records: mergedRecords };
          localStorage.setItem(key, JSON.stringify(reconciled));
          dataRef.current = reconciled;
          setData(reconciled);
          setDraft(reconciled.records.find(item => item.id === activeId)?.draft ?? normalizeDraft(null));
          if (syncFailed) {
            setStatus("Unsynced changes were recovered from this browser. Export your draft and retry saving before using another device.");
          }
          setReady(true);
          return;
        }
        if (saved && !localStorage.getItem(marker)) {
          const local = JSON.parse(saved) as WorkspaceData;
          if (local.version !== 2 || !Array.isArray(local.records)) throw new Error("Invalid local data");
          const existing = new Set(records.map(record => record.id));
          for (const record of local.records) {
            if (!existing.has(record.id)) await saveRecord(ownerId, { ...record, draft: normalizeDraft(record.draft) }, true);
            for (const profile of record.draft.profiles ?? []) {
              const images = await readAttachments(profile.id);
              await Promise.all(images.map(image => uploadAttachment(ownerId, profile.id, image.id, image.file)));
              const uploaded = await listAttachments(ownerId, profile.id);
              if (images.some(image => !uploaded.some(item => item.id === image.id))) throw new Error("Screenshot verification failed");
            }
          }
          records = await listRecords();
          if (local.records.some(record => !records.some(item => item.id === record.id))) throw new Error("Record verification failed");
          localStorage.setItem(marker, "1");
          localStorage.removeItem(legacyKey);
          await deleteAttachments(null).catch(() => {});
        }
        if (!active) return;
        const typed = records.map(record => ({ ...record, draft: normalizeDraft(record.draft as Partial<Draft>) }));
        const activeId = typed[0]?.id ?? null;
        const next: WorkspaceData = { version: 2, activeId, records: typed };
        dataRef.current = next; setData(next); setDraft(typed[0]?.draft ?? normalizeDraft(null)); setReady(true);
      } catch { if (active) setStatus("Could not load or migrate data to Supabase. Your browser copy is unchanged. Refresh to retry."); }
    }
    void load();
    return () => { active = false; };
  }, [ownerId, dirtyKey, initialRecords]);

  function persist(next: WorkspaceData): boolean {
    try { localStorage.setItem(key, JSON.stringify(next)); dataRef.current = next; setData(next); return true; }
    catch { setStatus("Could not save the browser backup. Check your browser storage."); return false; }
  }
  function queueSave(record: RecordEntry, immediate = false) {
    try { const pending = JSON.parse(localStorage.getItem(dirtyKey) || "{}") as Record<string, string>; pending[record.id] = record.updatedAt; localStorage.setItem(dirtyKey, JSON.stringify(pending)); } catch { setStatus("Could not mark the browser backup as unsynced."); }
    pendingRecordsRef.current.set(record.id, record);
    if (immediate) {
      void flushSaves();
      return;
    }
    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { void flushSaves(); }, 400);
  }
  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    const current = dataRef.current;
    const existing = current.records.find(item => item.id === current.activeId);
    if (!existing) {
      const id = crypto.randomUUID();
      const nextDraft = { ...normalizeDraft(null), [field]: value };
      const created: RecordEntry = { id, updatedAt: new Date().toISOString(), draft: nextDraft };
      const next: WorkspaceData = { version: 2, activeId: id, records: [created, ...current.records] };
      setDraft(nextDraft);
      if (persist(next)) queueSave(created);
      return;
    }
    const nextDraft = { ...existing.draft, [field]: value };
    const updated = { ...existing, draft: nextDraft, updatedAt: new Date().toISOString() };
    const next = { ...current, records: current.records.map(item => item.id === existing.id ? updated : item) };
    setDraft(nextDraft);
    if (persist(next)) queueSave(updated);
  }
  function updateDetail(detailKey: string, value: string) {
    update("details", { ...draft.details, [detailKey]: value });
  }
  function patchDraft(patch: Partial<Draft>) {
    const current = dataRef.current;
    const existing = current.records.find(item => item.id === current.activeId);
    if (!existing) {
      const id = crypto.randomUUID();
      const nextDraft = normalizeDraft({ ...draft, ...patch });
      const created: RecordEntry = { id, updatedAt: new Date().toISOString(), draft: nextDraft };
      const next: WorkspaceData = { version: 2, activeId: id, records: [created, ...current.records] };
      setDraft(nextDraft);
      if (persist(next)) queueSave(created);
      return;
    }
    const nextDraft = normalizeDraft({ ...existing.draft, ...patch });
    const updated = { ...existing, draft: nextDraft, updatedAt: new Date().toISOString() };
    const next = { ...current, records: current.records.map(item => item.id === existing.id ? updated : item) };
    setDraft(nextDraft);
    if (persist(next)) queueSave(updated);
  }
  async function generateField(targetField: string) {
    if (!keyConfigured) {
      setStatus("Add an OpenAI API key in Settings to generate fields.");
      return;
    }
    if (generatingField || generatingStrategy) return;
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
        setStatus(payload?.error || `Could not generate field (${res.status}).`);
        return;
      }
      if (targetField === "all_missing") {
        const mergedFields: Partial<Draft> = {};
        for (const [k, v] of Object.entries(payload.fields ?? {})) {
          if (typeof v === "string" && v.trim() && !(draft[k as keyof Draft] as string | undefined)?.trim()) {
            (mergedFields as Record<string, unknown>)[k] = v.trim();
          }
        }
        const mergedDetails = { ...draft.details };
        for (const [k, v] of Object.entries(payload.details ?? {})) {
          if (typeof v === "string" && v.trim() && !mergedDetails[k]?.trim()) {
            mergedDetails[k] = v.trim();
          }
        }
        patchDraft({ ...mergedFields, details: mergedDetails });
      } else if (typeof payload.value === "string" && payload.value.trim()) {
        if (targetField.startsWith("detail:")) {
          updateDetail(targetField.slice(7), payload.value.trim());
        } else {
          update(targetField as keyof Draft, payload.value.trim() as never);
        }
      }
    } catch {
      setStatus("Could not generate field content. Please try again.");
    } finally {
      setGeneratingField(null);
    }
  }
  function openRecord(id: string) {
    void flushSaves();
    const current = dataRef.current; const record = current.records.find(item => item.id === id);
    if (record && persist({ ...current, activeId: id })) { setDraft(normalizeDraft(record.draft)); setView("workspace"); }
  }
  async function deleteRecords(target: string | "all") {
    const current = dataRef.current; const doomed = target === "all" ? current.records : current.records.filter(item => item.id === target);
    try {
      for (const record of doomed) pendingRecordsRef.current.delete(record.id);
      await flushSaves();
      await Promise.all(doomed.flatMap(record => record.draft.profiles.map(profile => deleteProfileCloud(ownerId, profile.id))));
      await removeRecords(doomed.map(item => item.id));
      const remaining = target === "all" ? [] : current.records.filter(item => item.id !== target);
      const activeId = remaining.some(item => item.id === current.activeId) ? current.activeId : remaining[0]?.id ?? null;
      const next: WorkspaceData = { version: 2, activeId, records: remaining };
      if (!persist(next)) { setStatus("Deleted in Supabase, but browser backup could not be updated. Refresh to reload."); return; }
      setDraft(remaining.find(item => item.id === activeId)?.draft ?? normalizeDraft(null)); setDeleteTarget(null); setView("history");
    } catch { setStatus("Could not complete deletion in Supabase. Some screenshots may already have been deleted; please retry."); setDeleteTarget(null); }
  }
  function clearAll() {
    void flushSaves();
    const current = dataRef.current;
    persist({ ...current, activeId: null });
    setDraft(normalizeDraft(null));
    setCopied(false);
    setStatus("");
  }
  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft.strategy);
      setCopied(true);
      if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus("Could not copy the strategy draft to your clipboard.");
    }
  }
  async function savePdfs() {
    if (savingPdf) return;
    setSavingPdf(true);
    setStatus("");
    try {
      const { downloadStrategyPdfs } = await import("./pdf-export");
      await downloadStrategyPdfs(draft);
    } catch {
      setStatus("Could not generate the strategy PDF files. Please try again.");
    } finally {
      setSavingPdf(false);
    }
  }
  function cancelGeneration() {
    abortRef.current?.abort();
    abortRef.current = null;
    setGeneratingStrategy(false);
  }
  async function createOutline() {
    if (!keyConfigured) {
      const subject = draft.business.trim() || draft.name.trim() || "Client";
      const activeFields = getActiveBusinessFields(draft.businessType);
      const nicheLines = activeFields
        .map(f => {
          const val = draft.details[f.key]?.trim();
          return val ? `- ${f.label}: ${val}` : "";
        })
        .filter(Boolean)
        .join("\n");
      const diagnosticTemplate =
        draft.mode === "lead"
          ? `Internal Diagnostic Frameworks (Lead Proposal)\n\nNOISE Analysis (Pre-Pitch Audit)\n- Needs (What the brand is missing): \n- Opportunities (Areas for growth): \n- Improvements (Processes to fix): \n- Strengths (Current successes): ${draft.differentiator.trim() || draft.currentAssets.trim() || ""}\n- Exceptions (Known limitations): ${draft.constraints.trim() || ""}\n\nPESTLE Analysis (Macro-Environmental Urgency${draft.location.trim() ? ` — ${draft.location.trim()}` : ""})\n- Political: \n- Economic: \n- Social: \n- Technological: \n- Legal: \n- Environmental: \n\nSWOT Analysis (Competitive Baseline)\n- Strengths: ${draft.differentiator.trim() || ""}\n- Weaknesses: ${draft.challenges.trim() || ""}\n- Opportunities: ${draft.quickWin.trim() || ""}\n- Threats: `
          : `Internal Diagnostic Frameworks (Client Strategy)\n\nNOISE Analysis (Mid-Campaign Systems Audit)\n- Needs (Missing elements): \n- Opportunities (Growth levers): \n- Improvements (Operational bottlenecks): ${draft.campaignHistory.trim() || ""}\n- Strengths (Current successes): ${draft.baselineKpis.trim() || ""}\n- Exceptions (Known limitations): ${draft.constraints.trim() || ""}\n\nTOWS Matrix (Tactical Pivots)\n- SO (Strengths + Opportunities): \n- WO (Weaknesses + Opportunities): \n- ST (Strengths + Threats): \n- WT (Weaknesses + Threats): `;
      update("strategy", `${draft.mode === "lead" ? "Lead Proposal" : "Client Strategy"} — ${subject}\n\nObjective\n${draft.goals.trim() || "Add the primary business objective."}\n\nAudience\n${draft.audience.trim() || "Describe the target audience."}${nicheLines ? `\n\nIndustry & Niche Context\n${nicheLines}` : ""}\n\nOpportunities\n${draft.findings.filter(f => f.observation.trim()).map(f => `- ${f.observation.trim()}${f.category ? ` [${f.category}]` : ""}${f.status ? ` [${f.status}]` : ""}${f.source ? ` — ${f.source}` : ""}${f.date ? ` (${f.date})` : ""}`).join("\n") || "Review the research and identify opportunities."}\n\n${diagnosticTemplate}\n\nStrategy to Apply (Internal Execution Playbook)\nDefine the core positioning, channel playbooks, content pillars, and conversion mechanics to execute.\n\nWhat to Tell the Client (Client-Facing Narrative via SOAR)\n- Strengths (What’s Already Working): \n- Opportunities (Where the Untapped Growth Is): \n- Aspirations (What the Organisation Wants to Build): \n- Results (KPIs to Track Success): \n\nRecommended Services\nMonthly Packages:\n- Essentials (From $650 USD / month): 12 content pieces/mo, up to 2 profiles, 2 hrs/mo community management, monthly report\n- Growth (From $1,100 USD / month): 20 content pieces/mo (up to 4 short videos), up to 3 profiles, 3 hrs/mo community management, monthly 30-min strategy call\n- Complete (From $1,750 USD / month): 24 content pieces/mo (up to 6 short videos), up to 3 profiles, 4 hrs/mo community management, monthly 30-min strategy call, WordPress care (up to 2 hrs/mo), CRM & automation maintenance (up to 2 hrs/mo combined)\nAdd-ons:\n- Website Care (From $250 USD / month): Routine updates, backups & small changes for 1 existing WordPress site (up to 2 hrs/mo)\n- SEO Audit (From $450 USD / project): Technical & on-page review of 1 website with prioritized findings report\n- CRM Setup (From $600 USD / project): 1 CRM, 1 pipeline, and basic workflow configuration\n- Automation Build (From $750 USD / project): 1 workflow connecting up to 2 existing tools\n\n30 / 60 / 90 Day Roadmap\nDays 1–30: Foundation and planning\nDays 31–60: Launch and execution\nDays 61–90: Review and optimisation\n\nMeasurement\nDefine the baseline and appropriate KPIs.`);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setGeneratingStrategy(true);
    setGenerationPhase("thinking");
    setStatus("");
    let accumulated = "";
    try {
      const response = await fetch("/strategy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, model, reasoningEffort }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const errPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(errPayload?.error || `OpenAI request failed (${response.status}).`);
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line) continue;
          try {
            const packet = JSON.parse(line) as { type?: string; text?: string; message?: string };
            if (packet.type === "delta" && typeof packet.text === "string") {
              setGenerationPhase("writing");
              accumulated += packet.text;
              setDraft(current => ({ ...current, strategy: accumulated }));
            } else if (packet.type === "error" && packet.message) {
              setStatus(packet.message);
            }
          } catch {
            // Ignore malformed line
          }
        }
      }
      if (accumulated.trim()) {
        update("strategy", accumulated.trim());
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        if (accumulated.trim()) update("strategy", accumulated.trim());
      } else {
        setStatus("Could not generate strategy with OpenAI. Please try again.");
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setGeneratingStrategy(false);
    }
  }

  const activeBusinessFields = getActiveBusinessFields(draft.businessType);
  const placeholders = getPlaceholders(draft.businessType);
  const resolvedBusinessLabel =
    draft.businessType === "Other"
      ? (draft.businessTypeOther ?? "").trim() || "Custom Business Type"
      : formatBusinessTypeLabel(draft.businessType);
  function isFieldGenerating(targetKey: string, currentValue: string | undefined): boolean {
    if (!generatingField) return false;
    if (generatingField === targetKey) return true;
    return generatingField === "all_missing" && !(currentValue ?? "").trim();
  }

  return (
    <main id="main-content" className="strategy-page">
      <div className="strategy-shell"><h1 className="strategy-sr-only">Strategy Workspace</h1>{confirmOutline && <ConfirmOutline onCancel={() => setConfirmOutline(false)} onConfirm={() => { setConfirmOutline(false); void createOutline(); }} />}<nav className="strategy-nav" aria-label="Workspace navigation"><button type="button" aria-current={view === "workspace" ? "page" : undefined} onClick={() => setView("workspace")}>Home</button><button type="button" aria-current={view === "history" ? "page" : undefined} onClick={() => setView("history")}>History</button><button type="button" aria-current={view === "settings" ? "page" : undefined} onClick={() => setView("settings")}>Settings</button><form action={logout}><button type="submit">Sign Out</button></form></nav>
        {status && <p className="strategy-status" role="alert">{status}</p>}
        {deleteTarget && <ConfirmDelete all={deleteTarget === "all"} name={data.records.find(item => item.id === deleteTarget)?.draft.business || data.records.find(item => item.id === deleteTarget)?.draft.name || "this record"} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteRecords(deleteTarget)} />}
        {view === "history" && <section className="strategy-history"><div className="strategy-heading"><h2>History<span>.</span></h2><p>Records and screenshots are stored privately in Supabase.</p></div><div className="history-list">{data.records.length === 0 ? <p>No saved records yet.</p> : data.records.map(record => <article key={record.id} className="history-record"><div><h3>{record.draft.business || record.draft.name || "Untitled Strategy"}</h3><p>{record.draft.mode === "client" ? "Client Strategy" : "Lead Proposal"} · Updated {new Date(record.updatedAt).toLocaleDateString()}</p></div><div className="history-actions"><button type="button" onClick={() => openRecord(record.id)}>Open</button><button type="button" onClick={() => setDeleteTarget(record.id)}>Delete</button></div></article>)}</div><button className="history-delete-all" type="button" disabled={!ready} onClick={() => setDeleteTarget("all")}>Delete All Workspace Data</button></section>}
        {view === "settings" && <section className="strategy-settings"><div className="strategy-heading"><h2>Settings<span>.</span></h2><p>Manage the workspace’s integrations and data.</p></div><div className="settings-card"><form className="settings-key-form" onSubmit={async event => {
          event.preventDefault();
          if (!apiKeyInput.trim() || keyBusy) return;
          setKeyBusy(true);
          setKeyMessage("");
          try {
            const result = await saveOpenAIKey(apiKeyInput);
            setApiKeyInput("");
            setKeyConfigured(result.configured);
            setCustomKeySaved(result.hasCustomKey);
            setMaskedKey(result.maskedKey);
            setKeyMessage(result.message);
          } catch {
            setKeyMessage("Could not save the API key. Please try again.");
          } finally {
            setKeyBusy(false);
          }
        }}><label>OpenAI API Key<input type="password" name="openaiApiKey" autoComplete="new-password" spellCheck={false} placeholder={maskedKey || (keyConfigured ? "sk-proj-************" : "sk-...")} value={apiKeyInput} disabled={keyBusy} onChange={e => setApiKeyInput(e.target.value)} /></label><div className="strategy-actions"><button className="strategy-button" type="submit" disabled={keyBusy || !apiKeyInput.trim()}>{keyBusy ? "Saving…" : keyConfigured ? "Update API Key" : "Save API Key"}</button>{customKeySaved && <button type="button" disabled={keyBusy} onClick={async () => {
          setKeyBusy(true);
          setKeyMessage("");
          try {
            const result = await removeOpenAIKey();
            setApiKeyInput("");
            setKeyConfigured(result.configured);
            setCustomKeySaved(result.hasCustomKey);
            setMaskedKey(result.maskedKey);
            setKeyMessage(result.message);
          } catch {
            setKeyMessage("Could not remove the saved API key.");
          } finally {
            setKeyBusy(false);
          }
        }}>Remove Saved Key</button>}</div>{keyMessage && <p className="settings-key-status" role="status">{keyMessage}</p>}</form><form className="strategy-fields settings-model-fields" onSubmit={async event => {
          event.preventDefault();
          if (prefsBusy) return;
          setPrefsBusy(true);
          setPrefsMessage("");
          try {
            const saved = await saveOpenAIPreferences(model, reasoningEffort);
            setModel(saved.model);
            setReasoningEffort(saved.reasoningEffort);
            setSavedModel(saved.model);
            setSavedReasoningEffort(saved.reasoningEffort);
            setPrefsMessage("Model settings saved.");
          } catch {
            setPrefsMessage("Could not save model settings. Please try again.");
          } finally {
            setPrefsBusy(false);
          }
        }}><CustomSelect label="OpenAI Model" value={model} disabled={prefsBusy} onChange={value => {
          setModel(value as OpenAIModel);
          setPrefsMessage("");
        }} options={[{ value: "gpt-6.1-terra", label: "GPT-6.1 Terra" }]} /><CustomSelect label="Reasoning Effort" value={reasoningEffort} disabled={prefsBusy} onChange={value => {
          setReasoningEffort(value as ReasoningEffort);
          setPrefsMessage("");
        }} options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium (Default)" }, { value: "high", label: "High" }, { value: "xhigh", label: "XHigh" }, { value: "max", label: "Max" }]} /><div className="strategy-actions"><button className="strategy-button" type="submit" disabled={prefsBusy || (model === savedModel && reasoningEffort === savedReasoningEffort)}>{prefsBusy ? "Saving…" : "Save"}</button></div>{prefsMessage && <p className="settings-key-status" role="status">{prefsMessage}</p>}</form></div></section>}
        {view === "workspace" && <>
        <fieldset className="strategy-modes" disabled={!ready}><legend>Choose a Strategy Type</legend>
          {[["lead", "Lead Proposal", "Develop an opportunity for a prospective client."], ["client", "Client Strategy", "Plan the work for an existing client."]].map(([value, title, description]) => <label className={`strategy-mode ${draft.mode === value ? "is-selected" : ""}`} key={value}><input type="radio" name="mode" checked={draft.mode === value} onChange={() => update("mode", value)} /><span><strong>{title}</strong><small>{description}</small></span></label>)}
        </fieldset>
        <section className="strategy-section"><div className="strategy-heading"><span>01 / THE BRIEF</span><h2>Client Brief<span>.</span></h2><p>Start with what you know. You can come back and add more anytime.</p></div>
          <div className="strategy-fields">
            <CustomSelect label="Business Type" value={draft.businessType} disabled={!ready} onChange={value => update("businessType", value)} options={[{ value: "", label: "Select a Business Type" }, ...(draft.businessType && !(businessTypes as readonly string[]).includes(draft.businessType) ? [{ value: draft.businessType, label: draft.businessType }] : []), ...businessTypes.map(type => ({ value: type, label: formatBusinessTypeLabel(type) }))]} />
            {draft.businessType === "Other" && <label>Specify Business Type<input placeholder="Enter a business type or niche" value={draft.businessTypeOther} disabled={!ready} onChange={e => update("businessTypeOther", e.target.value)} /></label>}

            <div className="strategy-subpanel" role="group" aria-label="Main source for autofill">
              <div className="strategy-subpanel-header">
                <span>QUICK SOURCE</span>
                <h3>Source Info for Cold Outreach</h3>
              </div>
              <label>
                {placeholders.mainSourceLabel}
                <textarea
                  rows={3}
                  placeholder={placeholders.mainSourcePlaceholder}
                  value={draft.mainSource ?? ""}
                  disabled={!ready}
                  onChange={e => update("mainSource", e.target.value)}
                />
              </label>
              <div className="strategy-source-actions">
                <small>Paste a link or bio above, then click the spark icon on any field—or fill all blank fields at once.</small>
                <button
                  type="button"
                  className={`strategy-autofill-btn ${generatingField === "all_missing" ? "is-loading" : ""}`}
                  disabled={!ready || Boolean(generatingField) || generatingStrategy}
                  onClick={() => void generateField("all_missing")}
                >
                  <SparkIcon />
                  {generatingField === "all_missing" ? "Filling Blank Fields…" : "Fill Blank Fields"}
                </button>
              </div>
            </div>

            {activeBusinessFields.length > 0 && (
              <div className="strategy-subpanel" role="group" aria-label={`${resolvedBusinessLabel} inputs`}>
                <div className="strategy-subpanel-header">
                  <span>BUSINESS DETAILS</span>
                  <h3>{resolvedBusinessLabel}</h3>
                </div>
                {activeBusinessFields.map(field => {
                  const targetKey = `detail:${field.key}`;
                  const currentVal = draft.details[field.key] ?? "";
                  const loading = isFieldGenerating(targetKey, currentVal);
                  return field.type === "select" && field.options ? (
                    <CustomSelect
                      key={field.key}
                      label={field.label}
                      value={currentVal}
                      disabled={!ready}
                      onChange={value => updateDetail(field.key, value)}
                      options={field.options}
                    />
                  ) : field.type === "textarea" ? (
                    <div className="strategy-field" key={field.key}>
                      <label htmlFor={`field-${field.key}`}>{field.label}</label>
                      <div className={`strategy-input-wrap is-textarea ${loading ? "is-loading" : ""}`}>
                        <textarea
                          id={`field-${field.key}`}
                          rows={3}
                          placeholder={loading && !currentVal ? "Generating…" : field.placeholder}
                          value={currentVal}
                          disabled={!ready}
                          onChange={e => updateDetail(field.key, e.target.value)}
                        />
                        <button
                          type="button"
                          className={`strategy-spark-btn ${loading ? "is-loading" : ""}`}
                          title={`Generate ${field.label}`}
                          aria-label={`Generate ${field.label}`}
                          disabled={!ready || Boolean(generatingField) || generatingStrategy}
                          onClick={() => void generateField(targetKey)}
                        >
                          <SparkIcon />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="strategy-field" key={field.key}>
                      <label htmlFor={`field-${field.key}`}>{field.label}</label>
                      <div className={`strategy-input-wrap is-input ${loading ? "is-loading" : ""}`}>
                        <input
                          id={`field-${field.key}`}
                          type="text"
                          placeholder={loading && !currentVal ? "Generating…" : field.placeholder}
                          value={currentVal}
                          disabled={!ready}
                          onChange={e => updateDetail(field.key, e.target.value)}
                        />
                        <button
                          type="button"
                          className={`strategy-spark-btn ${loading ? "is-loading" : ""}`}
                          title={`Generate ${field.label}`}
                          aria-label={`Generate ${field.label}`}
                          disabled={!ready || Boolean(generatingField) || generatingStrategy}
                          onClick={() => void generateField(targetKey)}
                        >
                          <SparkIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="strategy-grid-2">
              {([["name", "Client Name", placeholders.name, false], ["business", "Business Name", placeholders.business, false], ["website", "Website", placeholders.website, false], ["location", "Location or Market", placeholders.location, true]] as const).map(([field, label, placeholder, spark]) => {
                const loading = spark && isFieldGenerating(field, draft[field]);
                return spark ? (
                  <div className="strategy-field" key={field}>
                    <label htmlFor={`field-${field}`}>{label}</label>
                    <div className={`strategy-input-wrap is-input ${loading ? "is-loading" : ""}`}>
                      <input id={`field-${field}`} type="text" placeholder={loading && !draft[field] ? "Generating…" : placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} />
                      <button type="button" className={`strategy-spark-btn ${loading ? "is-loading" : ""}`} title={`Generate ${label}`} aria-label={`Generate ${label}`} disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField(field)}><SparkIcon /></button>
                    </div>
                  </div>
                ) : (
                  <label key={field}>{label}<input type={field === "website" ? "url" : "text"} placeholder={placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} /></label>
                );
              })}
            </div>

            {([["about", "About the Business", placeholders.about], ["differentiator", "What Makes Them Different", placeholders.differentiator], ["audience", "Target Audience", placeholders.audience], ["goals", "Main Goals", placeholders.goals], ["offerings", "Products or Services", placeholders.offerings], ["challenges", "Marketing Challenges", placeholders.challenges], ["competitors", "Competitors", placeholders.competitors]] as const).map(([field, label, placeholder]) => {
              const loading = isFieldGenerating(field, draft[field]);
              return (
                <div className="strategy-field" key={field}>
                  <label htmlFor={`field-${field}`}>{label}</label>
                  <div className={`strategy-input-wrap is-textarea ${loading ? "is-loading" : ""}`}>
                    <textarea id={`field-${field}`} rows={3} placeholder={loading && !draft[field] ? "Generating…" : placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${loading ? "is-loading" : ""}`} title={`Generate ${label}`} aria-label={`Generate ${label}`} disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField(field)}><SparkIcon /></button>
                  </div>
                </div>
              );
            })}

            <div className="strategy-grid-2">
              {([["conversionGoal", "Desired Customer Action", placeholders.conversionGoal], ["brandVoice", "Brand Voice", placeholders.brandVoice]] as const).map(([field, label, placeholder]) => {
                const loading = isFieldGenerating(field, draft[field]);
                return (
                  <div className="strategy-field" key={field}>
                    <label htmlFor={`field-${field}`}>{label}</label>
                    <div className={`strategy-input-wrap is-input ${loading ? "is-loading" : ""}`}>
                      <input id={`field-${field}`} type="text" placeholder={loading && !draft[field] ? "Generating…" : placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} />
                      <button type="button" className={`strategy-spark-btn ${loading ? "is-loading" : ""}`} title={`Generate ${label}`} aria-label={`Generate ${label}`} disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField(field)}><SparkIcon /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="strategy-subpanel" role="group" aria-label="Content, tools, and budget">
              <div className="strategy-subpanel-header">
                <span>PRACTICAL DETAILS</span>
                <h3>Content, Tools & Budget</h3>
              </div>
              <div className="strategy-grid-2">
                <CustomSelect label="Video & Photo Availability" value={draft.videoCapacity} disabled={!ready} onChange={value => update("videoCapacity", value)} options={videoCapacityOptions} />
                <CustomSelect label="Monthly Budget / Package" value={draft.budgetTier} disabled={!ready} onChange={value => update("budgetTier", value)} options={budgetTierOptions} />
              </div>
              <div className="strategy-grid-2">
                {([["techStack", "Website Platform & Tools Used", placeholders.techStack], ["timeline", "Important Dates or Seasons", placeholders.timeline]] as const).map(([field, label, placeholder]) => {
                  const loading = isFieldGenerating(field, draft[field]);
                  return (
                    <div className="strategy-field" key={field}>
                      <label htmlFor={`field-${field}`}>{label}</label>
                      <div className={`strategy-input-wrap is-input ${loading ? "is-loading" : ""}`}>
                        <input id={`field-${field}`} type="text" placeholder={loading && !draft[field] ? "Generating…" : placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} />
                        <button type="button" className={`strategy-spark-btn ${loading ? "is-loading" : ""}`} title={`Generate ${label}`} aria-label={`Generate ${label}`} disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField(field)}><SparkIcon /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="strategy-field">
                <label htmlFor="field-currentAssets">Existing Audience & Marketing Materials</label>
                <div className={`strategy-input-wrap is-input ${isFieldGenerating("currentAssets", draft.currentAssets) ? "is-loading" : ""}`}>
                  <input id="field-currentAssets" type="text" placeholder={isFieldGenerating("currentAssets", draft.currentAssets) && !draft.currentAssets ? "Generating…" : placeholders.currentAssets} value={draft.currentAssets} disabled={!ready} onChange={e => update("currentAssets", e.target.value)} />
                  <button type="button" className={`strategy-spark-btn ${isFieldGenerating("currentAssets", draft.currentAssets) ? "is-loading" : ""}`} title="Generate Existing Audience & Marketing Materials" aria-label="Generate Existing Audience & Marketing Materials" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("currentAssets")}><SparkIcon /></button>
                </div>
              </div>
              <div className="strategy-field">
                <label htmlFor="field-constraints">Limits or Things to Avoid</label>
                <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("constraints", draft.constraints) ? "is-loading" : ""}`}>
                  <textarea id="field-constraints" rows={2} placeholder={isFieldGenerating("constraints", draft.constraints) && !draft.constraints ? "Generating…" : placeholders.constraints} value={draft.constraints} disabled={!ready} onChange={e => update("constraints", e.target.value)} />
                  <button type="button" className={`strategy-spark-btn ${isFieldGenerating("constraints", draft.constraints) ? "is-loading" : ""}`} title="Generate Limits or Things to Avoid" aria-label="Generate Limits or Things to Avoid" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("constraints")}><SparkIcon /></button>
                </div>
              </div>
            </div>

            {draft.mode === "lead" ? (
              <div className="strategy-subpanel" role="group" aria-label="Proposal details">
                <div className="strategy-subpanel-header">
                  <span>PROPOSAL DETAILS</span>
                  <h3>Why They Need Help Now</h3>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-leadTrigger">Why Are They Reaching Out Now?</label>
                  <div className={`strategy-input-wrap is-input ${isFieldGenerating("leadTrigger", draft.leadTrigger) ? "is-loading" : ""}`}>
                    <input id="field-leadTrigger" type="text" placeholder={isFieldGenerating("leadTrigger", draft.leadTrigger) && !draft.leadTrigger ? "Generating…" : placeholders.leadTrigger} value={draft.leadTrigger} disabled={!ready} onChange={e => update("leadTrigger", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("leadTrigger", draft.leadTrigger) ? "is-loading" : ""}`} title="Generate Why Are They Reaching Out Now?" aria-label="Generate Why Are They Reaching Out Now?" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("leadTrigger")}><SparkIcon /></button>
                  </div>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-quickWin">Biggest Quick Win</label>
                  <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("quickWin", draft.quickWin) ? "is-loading" : ""}`}>
                    <textarea id="field-quickWin" rows={2} placeholder={isFieldGenerating("quickWin", draft.quickWin) && !draft.quickWin ? "Generating…" : placeholders.quickWin} value={draft.quickWin} disabled={!ready} onChange={e => update("quickWin", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("quickWin", draft.quickWin) ? "is-loading" : ""}`} title="Generate Biggest Quick Win" aria-label="Generate Biggest Quick Win" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("quickWin")}><SparkIcon /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="strategy-subpanel" role="group" aria-label="Current client details">
                <div className="strategy-subpanel-header">
                  <span>CURRENT CLIENT DETAILS</span>
                  <h3>Current Results & What’s Working</h3>
                </div>
                <CustomSelect label="Current Package" value={draft.activePackage} disabled={!ready} onChange={value => update("activePackage", value)} options={activePackageOptions} />
                <div className="strategy-field">
                  <label htmlFor="field-baselineKpis">Current Numbers & Results</label>
                  <div className={`strategy-input-wrap is-input ${isFieldGenerating("baselineKpis", draft.baselineKpis) ? "is-loading" : ""}`}>
                    <input id="field-baselineKpis" type="text" placeholder={isFieldGenerating("baselineKpis", draft.baselineKpis) && !draft.baselineKpis ? "Generating…" : placeholders.baselineKpis} value={draft.baselineKpis} disabled={!ready} onChange={e => update("baselineKpis", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("baselineKpis", draft.baselineKpis) ? "is-loading" : ""}`} title="Generate Current Numbers & Results" aria-label="Generate Current Numbers & Results" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("baselineKpis")}><SparkIcon /></button>
                  </div>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-campaignHistory">What’s Working & What’s Not</label>
                  <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("campaignHistory", draft.campaignHistory) ? "is-loading" : ""}`}>
                    <textarea id="field-campaignHistory" rows={3} placeholder={isFieldGenerating("campaignHistory", draft.campaignHistory) && !draft.campaignHistory ? "Generating…" : placeholders.campaignHistory} value={draft.campaignHistory} disabled={!ready} onChange={e => update("campaignHistory", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("campaignHistory", draft.campaignHistory) ? "is-loading" : ""}`} title="Generate What’s Working & What’s Not" aria-label="Generate What’s Working & What’s Not" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("campaignHistory")}><SparkIcon /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>02 / SOCIAL PROFILES</span><h2>Social Profiles<span>.</span></h2><p>Add each account separately. All fields are optional.</p></div>
          <div className="strategy-records">{draft.profiles.map((profile, index) => <div className="strategy-record" key={profile.id}><div className="strategy-record-header"><h3>Profile {index + 1}</h3><button type="button" aria-label={`Remove Profile ${index + 1}`} onClick={async () => { try { await flushSaves(); await deleteProfileCloud(ownerId, profile.id); update("profiles", draft.profiles.filter(item => item.id !== profile.id)); } catch { setStatus("Could not remove this profile’s screenshots. Please try again."); } }}>Remove</button></div><div className="strategy-fields">
            <div className="strategy-grid-2">
              <CustomSelect label="Platform" value={profile.platform} onChange={value => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, platform: value } : item))} options={[{ value: "", label: "Not Provided" }, ...socialPlatforms.map(value => ({ value, label: value }))]} />
              <CustomSelect label="Status" value={profile.status ?? ""} onChange={value => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, status: value } : item))} options={profileStatuses} />
            </div>
            <label>Profile URL<input type="url" placeholder="https://" value={profile.url} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, url: e.target.value } : item))} /></label>
            <div className="strategy-grid-2">
              <label>Followers or Subscribers<input type="text" placeholder={placeholders.profileFollowers} value={profile.followers ?? ""} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, followers: e.target.value } : item))} /></label>
              <label>How Often They Post<input type="text" placeholder={placeholders.profileCadence} value={profile.cadence ?? ""} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, cadence: e.target.value } : item))} /></label>
            </div>
            <label>Notes<textarea rows={3} placeholder={placeholders.profileNotes} value={profile.notes} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, notes: e.target.value } : item))} /></label>
            <CloudAttachments ownerId={ownerId} profileId={profile.id} profileNumber={index + 1} />
          </div></div>)}</div><button className="strategy-add" type="button" disabled={!ready} onClick={() => update("profiles", [...draft.profiles, { id: crypto.randomUUID(), platform: "", url: "", status: "", followers: "", cadence: "", notes: "" }])}>Add Social Profile</button>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>03 / RESEARCH</span><h2>What Have You Found<span>?</span></h2><p>Save your notes from reviewing their website, social accounts, or competitors.</p></div>
          <div className="strategy-records">{draft.findings.map((finding, index) => <div className="strategy-record" key={finding.id}><div className="strategy-record-header"><h3>Finding {index + 1}</h3><button type="button" aria-label={`Remove Finding ${index + 1}`} onClick={() => update("findings", draft.findings.filter(item => item.id !== finding.id))}>Remove</button></div><div className="strategy-fields">
            <label>Source<input placeholder={placeholders.findingSource} value={finding.source} onChange={e => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, source: e.target.value } : item))} /></label>
            <div className="strategy-grid-2">
              <CustomSelect label="Topic" value={finding.category ?? ""} onChange={value => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, category: value } : item))} options={findingCategories} />
              <CustomSelect label="How You Found This" value={finding.status} onChange={value => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, status: value } : item))} options={[{ value: "", label: "Not Specified" }, { value: "observed", label: "Observed Directly" }, { value: "client-provided", label: "Shared by Client" }, { value: "inferred", label: "Estimated / Assumed" }]} />
            </div>
            <div className="strategy-date-field"><label htmlFor={`date-${finding.id}`}>Date</label><DatePicker id={`date-${finding.id}`} value={finding.date} onChange={date => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, date } : item))} /></div>
            <label>Notes<textarea rows={4} placeholder={placeholders.findingObservation} value={finding.observation} onChange={e => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, observation: e.target.value } : item))} /></label>
          </div></div>)}</div><button className="strategy-add" type="button" disabled={!ready} onClick={() => update("findings", [...draft.findings, { id: crypto.randomUUID(), source: "", date: "", observation: "", status: "", category: "" }])}>Add Finding</button>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>04 / STRATEGY</span><h2>Make a Plan<span>.</span></h2><p>Generate a tailored strategy from your brief and research, then edit it below.</p></div><div className="strategy-actions"><button className="strategy-button" type="button" disabled={!ready || generatingStrategy} onClick={() => draft.strategy.trim() ? setConfirmOutline(true) : void createOutline()}>{generatingStrategy ? (generationPhase === "thinking" ? `Thinking (${elapsedSeconds}s)…` : `Writing Strategy (${elapsedSeconds}s)…`) : "Create Starting Outline"}</button>{generatingStrategy && <button type="button" onClick={cancelGeneration}>Cancel</button>}</div><label className="strategy-editor">Strategy Draft<textarea rows={18} placeholder="Your editable strategy will appear here." value={draft.strategy} disabled={!ready || generatingStrategy} onChange={e => update("strategy", e.target.value)} /></label><div className="strategy-actions"><button type="button" onClick={clearAll} disabled={!ready || generatingStrategy || savingPdf}>Clear All</button><button type="button" onClick={copyDraft} disabled={!ready || generatingStrategy || savingPdf}>{copied ? "Copied" : "Copy Draft"}</button><button type="button" onClick={() => void savePdfs()} disabled={!ready || generatingStrategy || savingPdf}>{savingPdf ? "Saving PDFs…" : "Save PDF"}</button></div></section>
        </>}
      </div>
    </main>
  );
}
