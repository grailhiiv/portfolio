"use client";

import { useEffect, useRef, useState } from "react";
import { logout } from "../login/actions";
import { removeOpenAIKey, saveOpenAIKey, saveOpenAIPreferences, type OpenAIModel, type ReasoningEffort } from "./actions";
import { removeRecords, deleteProfileCloud, deleteAttachmentPaths, readAttachment, type CloudRecord } from "./cloud";
import { useStrategyStorage, type RecordEntry, type WorkspaceData } from "./use-strategy-storage";
import CustomSelect from "./custom-select";
import SourceAudit from "./source-audit";
import { mergeSourceProfiles, sourcePlatform, sourceKey } from "./source-links";
import ConfirmDelete from "./confirm-delete";
import {
  emptyDraft,
  normalizeDraft,
  type Draft,
} from "./schema";

const empty: Draft = emptyDraft;


export default function StrategyWorkspace({ ownerId, openAIConfigured, hasCustomOpenAIKey = false, maskedOpenAIKey = null, initialModel = "gpt-6.1-terra", initialReasoningEffort = "medium", initialRecords = null }: { ownerId: string; openAIConfigured: boolean; hasCustomOpenAIKey?: boolean; maskedOpenAIKey?: string | null; initialModel?: OpenAIModel; initialReasoningEffort?: ReasoningEffort; initialRecords?: CloudRecord[] | null }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [documentKind, setDocumentKind] = useState<"audit" | "proposal" | "strategy">("strategy");
  const [auditKey, setAuditKey] = useState(0);
  const [openAuditResults, setOpenAuditResults] = useState(false);
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"workspace" | "history" | "settings" | "documents">("workspace");
  useEffect(() => { const sync = () => { if (location.hash === "#history") setView("history"); else if (location.hash === "#settings") setView("settings"); }; sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync); }, []);
  const [keyConfigured, setKeyConfigured] = useState(openAIConfigured);
  const [customKeySaved, setCustomKeySaved] = useState(hasCustomOpenAIKey);
  const [maskedKey, setMaskedKey] = useState<string | null>(maskedOpenAIKey);
  const [model, setModel] = useState<OpenAIModel>(initialModel);
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(initialReasoningEffort);
  const [savedModel, setSavedModel] = useState<OpenAIModel>(initialModel);
  const [savedReasoningEffort, setSavedReasoningEffort] = useState<ReasoningEffort>(initialReasoningEffort);
  const [prefsBusy, setPrefsBusy] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyMessage, setKeyMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | "all" | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current); }, []);
  const { ready, data, dataRef, pendingRecordsRef, flushSaves, persist, queueSave } = useStrategyStorage(ownerId, initialRecords, setDraft, setStatus);

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
  function applyAudit(patch: Partial<Draft>): boolean {
    const current = dataRef.current;
    const existing = current.records.find(item => item.id === current.activeId);
    if (!existing) return false;
    const nextDraft = normalizeDraft({ ...existing.draft, ...patch });
    const updated = { ...existing, draft: nextDraft, updatedAt: new Date().toISOString() };
    if (!persist({ ...current, records: current.records.map(item => item.id === existing.id ? updated : item) })) return false;
    setDraft(nextDraft); queueSave(updated); setDocumentKind(patch.proposal !== undefined ? "proposal" : patch.strategy !== undefined ? "strategy" : "audit"); return true;
  }
  function syncAuditSources(raw: string, otherSources: string[] = []) {
    const current = dataRef.current;
    const latest = current.records.find(item => item.id === current.activeId)?.draft ?? draft;
    const profiles = mergeSourceProfiles(raw, latest.profiles);
    const firstWebsite = raw.split(/\s+/).find(value => sourceKey(value) && !sourcePlatform(value) && !otherSources.includes(value));
    const website = firstWebsite || "";
    if (raw !== latest.auditSources || profiles.length !== latest.profiles.length || website !== latest.website || JSON.stringify(otherSources) !== JSON.stringify(latest.auditOtherSources)) patchDraft({ auditSources: raw, auditOtherSources: otherSources, profiles, website });
  }
  function openRecord(id: string) {
    setAuditKey(key => key + 1);
    void flushSaves();
    const current = dataRef.current; const record = current.records.find(item => item.id === id);
    if (record && persist({ ...current, activeId: id })) {
      const restored = normalizeDraft(record.draft);
      setDraft(restored);
      setOpenAuditResults(Boolean(restored.auditSnapshot || restored.auditReport));
      setStatus(restored.auditSnapshot || restored.auditReport ? "" : "This record has no saved audit results. Run an audit to add results to History.");
      setView("workspace");
    }
  }
  async function deleteRecords(target: string | "all") {
    const current = dataRef.current; const doomed = target === "all" ? current.records : current.records.filter(item => item.id === target);
    try {
      for (const record of doomed) pendingRecordsRef.current.delete(record.id);
      await flushSaves();
      await Promise.all(doomed.flatMap(record => record.draft.profiles.map(profile => deleteProfileCloud(ownerId, profile.id))));
      await deleteAttachmentPaths(doomed.flatMap(record => record.draft.auditEvidence.map(evidence => evidence.path)).filter(path => path.startsWith(`${ownerId}/`)));
      await removeRecords(doomed.map(item => item.id));
      const remaining = target === "all" ? [] : current.records.filter(item => item.id !== target);
      const activeId = remaining.some(item => item.id === current.activeId) ? current.activeId : remaining[0]?.id ?? null;
      const next: WorkspaceData = { version: 2, activeId, records: remaining };
      if (!persist(next)) { setStatus("Deleted in Supabase, but browser backup could not be updated. Refresh to reload."); return; }
      setDraft(remaining.find(item => item.id === activeId)?.draft ?? normalizeDraft(null)); setDeleteTarget(null); setView("history");
    } catch { setStatus("Could not complete deletion in Supabase. Some screenshots may already have been deleted; please retry."); setDeleteTarget(null); }
  }
  function clearAll() {
    setAuditKey(key => key + 1);
    setOpenAuditResults(false);
    void flushSaves();
    const current = dataRef.current;
    persist({ ...current, activeId: null });
    setDraft(normalizeDraft(null));
    setView("workspace");
    setCopied(false);
    setStatus("");
  }
  async function savePdfs() {
    if (savingPdf) return;
    setSavingPdf(true);
    setStatus("");
    try {
      const { downloadStrategyPdfs } = await import("./pdf-export");
      const evidence = await Promise.all(draft.auditEvidence.map(async item => {
        if (!item.path.startsWith(`${ownerId}/`)) throw new Error("Invalid evidence path");
        const blob = await readAttachment(item.path);
        const image = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Could not read evidence")); reader.readAsDataURL(blob); });
        return { ...item, image };
      }));
      const documentText = documentKind === "audit" ? draft.auditReport : documentKind === "proposal" ? draft.proposal : draft.strategy;
      await downloadStrategyPdfs({ ...draft, strategy: documentText, auditBased: documentKind !== "strategy" || draft.auditBased }, evidence, documentKind);
    } catch {
      setStatus("Could not generate the strategy PDF files. Please try again.");
    } finally {
      setSavingPdf(false);
    }
  }

  return (
    <main id="main-content" className="strategy-page">
      <div className="strategy-shell"><h1 className="strategy-sr-only">Strategy Workspace</h1><nav className="strategy-nav" aria-label="Workspace navigation"><button type="button" aria-current={view === "workspace" ? "page" : undefined} onClick={() => setView("workspace")}>Home</button><button type="button" aria-current={view === "history" ? "page" : undefined} onClick={() => setView("history")}>History</button>{(draft.auditReport || draft.proposal || draft.strategy) && <button type="button" aria-current={view === "documents" ? "page" : undefined} onClick={() => setView("documents")}>Documents</button>}<a href="/invoice">Invoice</a><button type="button" aria-current={view === "settings" ? "page" : undefined} onClick={() => setView("settings")}>Settings</button><form action={logout}><button type="submit">Sign Out</button></form></nav>
        {status && <p className="strategy-status" role="alert">{status}</p>}
        {deleteTarget && <ConfirmDelete all={deleteTarget === "all"} name={data.records.find(item => item.id === deleteTarget)?.draft.business || data.records.find(item => item.id === deleteTarget)?.draft.name || "this record"} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteRecords(deleteTarget)} />}
        {view === "history" && <section className="strategy-history"><div className="strategy-heading"><h2>History<span>.</span></h2></div><div className="history-list">{data.records.length === 0 ? <p>No saved records yet.</p> : data.records.map(record => <article key={record.id} className="history-record"><div><h3>{record.draft.business || record.draft.name || "Untitled Strategy"}</h3><p>Audit workspace · Updated {new Date(record.updatedAt).toLocaleDateString()}</p></div><div className="history-actions"><button type="button" onClick={() => openRecord(record.id)}>Open</button><button type="button" onClick={() => setDeleteTarget(record.id)}>Delete</button></div></article>)}</div><button className="history-delete-all" type="button" disabled={!ready} onClick={() => setDeleteTarget("all")}>Delete All History</button></section>}
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
        <SourceAudit key={auditKey} ownerId={ownerId} currentRecordId={() => dataRef.current.activeId} currentRecordVersion={() => dataRef.current.records.find(record => record.id === dataRef.current.activeId)?.updatedAt ?? null} draft={draft} ready={ready} openResults={openAuditResults} onApply={applyAudit} update={update} onSyncSources={syncAuditSources} />
        </>}
        {view === "documents" && <>
        {<section className="strategy-section"><div className="strategy-heading"><span>03 / DOCUMENTS</span><h2>Documents<span>.</span></h2><p>Review and edit each document separately.</p></div><fieldset className="audit-choice"><legend>Document</legend>{([["audit", "Audit"], ["proposal", "Proposal"], ["strategy", "Strategy"]] as const).map(([kind, label]) => <label key={kind}><input type="radio" name="document-kind" checked={documentKind === kind} onChange={() => setDocumentKind(kind)} />{label}</label>)}</fieldset><label className="strategy-editor"><textarea aria-label={`${documentKind} draft`} rows={18} placeholder={`Your ${documentKind} will appear here.`} value={documentKind === "audit" ? draft.auditReport : documentKind === "proposal" ? draft.proposal : draft.strategy} disabled={!ready} onChange={e => update(documentKind === "audit" ? "auditReport" : documentKind, e.target.value)} /></label><div className="strategy-actions"><button type="button" onClick={clearAll} disabled={!ready || savingPdf}>Clear All</button><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(documentKind === "audit" ? draft.auditReport : documentKind === "proposal" ? draft.proposal : draft.strategy); setCopied(true); if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current); copyTimerRef.current = setTimeout(() => setCopied(false), 2000); } catch { setStatus("Could not copy the document to your clipboard."); } }} disabled={!ready || savingPdf}>{copied ? "Copied" : "Copy Draft"}</button><button type="button" onClick={() => void savePdfs()} disabled={!ready || savingPdf || !(documentKind === "audit" ? draft.auditReport : documentKind === "proposal" ? draft.proposal : draft.strategy).trim()}>{savingPdf ? "Saving PDFs…" : "Save PDF"}</button></div></section>}
        </>}
      </div>
    </main>
  );
}
