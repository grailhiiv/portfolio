"use client";

import { useEffect, useRef, useState } from "react";
import { logout } from "../login/actions";
import { removeOpenAIKey, saveOpenAIKey, saveOpenAIPreferences, type OpenAIModel, type ReasoningEffort } from "./actions";
import CloudAttachments from "./cloud-attachments";
import { removeRecords, deleteProfileCloud, type CloudRecord } from "./cloud";
import { useStrategyStorage, type RecordEntry, type WorkspaceData } from "./use-strategy-storage";
import { useFieldGeneration } from "./use-field-generation";
import DatePicker from "./date-picker";
import CustomSelect from "./custom-select";
import ClientBrief from "./client-brief";
import { createLocalOutline } from "./local-outline";
import ConfirmOutline from "./confirm-outline";
import ConfirmDelete from "./confirm-delete";
import {
  emptyDraft,
  findingCategories,
  getPlaceholders,
  normalizeDraft,
  profileStatuses,
  socialPlatforms,
  type Draft,
  type Finding,
  type Profile,
} from "./schema";

const empty: Draft = emptyDraft;


export default function StrategyWorkspace({ ownerId, openAIConfigured, hasCustomOpenAIKey = false, maskedOpenAIKey = null, initialModel = "gpt-6.1-terra", initialReasoningEffort = "medium", initialRecords = null }: { ownerId: string; openAIConfigured: boolean; hasCustomOpenAIKey?: boolean; maskedOpenAIKey?: string | null; initialModel?: OpenAIModel; initialReasoningEffort?: ReasoningEffort; initialRecords?: CloudRecord[] | null }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [status, setStatus] = useState("");
  const [confirmOutline, setConfirmOutline] = useState(false);
  const [view, setView] = useState<"workspace" | "history" | "settings">("workspace");
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
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<"thinking" | "writing">("thinking");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyMessage, setKeyMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | "all" | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current); }, []);
  const { ready, data, dataRef, pendingRecordsRef, flushSaves, persist, queueSave } = useStrategyStorage(ownerId, initialRecords, setDraft, setStatus);
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
  const { generatingField, generateField } = useFieldGeneration({ draft, model, keyConfigured, generatingStrategy, dataRef, patchDraft, setStatus });
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
      update("strategy", createLocalOutline(draft));
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

  const placeholders = getPlaceholders(draft.businessType);

  return (
    <main id="main-content" className="strategy-page">
      <div className="strategy-shell"><h1 className="strategy-sr-only">Strategy Workspace</h1>{confirmOutline && <ConfirmOutline onCancel={() => setConfirmOutline(false)} onConfirm={() => { setConfirmOutline(false); void createOutline(); }} />}<nav className="strategy-nav" aria-label="Workspace navigation"><button type="button" aria-current={view === "workspace" ? "page" : undefined} onClick={() => setView("workspace")}>Home</button><button type="button" aria-current={view === "history" ? "page" : undefined} onClick={() => setView("history")}>History</button><a href="/invoice">Invoice</a><button type="button" aria-current={view === "settings" ? "page" : undefined} onClick={() => setView("settings")}>Settings</button><form action={logout}><button type="submit">Sign Out</button></form></nav>
        {status && <p className="strategy-status" role="alert">{status}</p>}
        {deleteTarget && <ConfirmDelete all={deleteTarget === "all"} name={data.records.find(item => item.id === deleteTarget)?.draft.business || data.records.find(item => item.id === deleteTarget)?.draft.name || "this record"} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteRecords(deleteTarget)} />}
        {view === "history" && <section className="strategy-history"><div className="strategy-heading"><h2>History<span>.</span></h2></div><div className="history-list">{data.records.length === 0 ? <p>No saved records yet.</p> : data.records.map(record => <article key={record.id} className="history-record"><div><h3>{record.draft.business || record.draft.name || "Untitled Strategy"}</h3><p>{record.draft.mode === "client" ? "Client Strategy" : "Lead Proposal"} · Updated {new Date(record.updatedAt).toLocaleDateString()}</p></div><div className="history-actions"><button type="button" onClick={() => openRecord(record.id)}>Open</button><button type="button" onClick={() => setDeleteTarget(record.id)}>Delete</button></div></article>)}</div><button className="history-delete-all" type="button" disabled={!ready} onClick={() => setDeleteTarget("all")}>Delete All History</button></section>}
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
        <ClientBrief draft={draft} ready={ready} generatingField={generatingField} generatingStrategy={generatingStrategy} update={update} updateDetail={updateDetail} generateField={generateField} />
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
