"use client";

import { useEffect, useRef, useState } from "react";
import { logout } from "../login/actions";
import { removeOpenAIKey, saveOpenAIKey } from "./actions";
import { deleteAttachments, readAttachments } from "./profile-attachments";
import CloudAttachments from "./cloud-attachments";
import { listRecords, saveRecord, removeRecords, uploadAttachment, deleteProfileCloud, listAttachments, type CloudRecord } from "./cloud";
import DatePicker from "./date-picker";
import CustomSelect from "./custom-select";
import ConfirmOutline from "./confirm-outline";
import ConfirmDelete from "./confirm-delete";

type Profile = { id: string; platform: string; url: string; notes: string };
type Finding = { id: string; source: string; date: string; observation: string; status: string };
type Draft = { mode: string; name: string; business: string; website: string; about: string; audience: string; goals: string; research: string; source: string; strategy: string; businessType: string; businessTypeOther: string; offerings: string; challenges: string; competitors: string; conversionGoal: string; profiles: Profile[]; findings: Finding[] };
const empty: Draft = { mode: "lead", name: "", business: "", website: "", about: "", audience: "", goals: "", research: "", source: "", strategy: "", businessType: "", businessTypeOther: "", offerings: "", challenges: "", competitors: "", conversionGoal: "", profiles: [], findings: [] };
const legacyKey = "grailhiiv-strategy-draft-v1";
const key = "grailhiiv-strategy-records-v2";
type RecordEntry = { id: string; updatedAt: string; draft: Draft };
type WorkspaceData = { version: 2; activeId: string | null; records: RecordEntry[] };
const businessTypes = ["Author or publisher", "Coach or consultant", "Creator or influencer", "E-commerce or retail", "Professional services", "Health and wellness", "Beauty and personal care", "Food and hospitality", "Real estate", "Education and training", "Technology or software", "Nonprofit or community", "Arts and entertainment", "Local services", "Other"];

export default function StrategyWorkspace({ ownerId, openAIConfigured, hasCustomOpenAIKey = false, initialRecords = null }: { ownerId: string; openAIConfigured: boolean; hasCustomOpenAIKey?: boolean; initialRecords?: CloudRecord[] | null }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmOutline, setConfirmOutline] = useState(false);
  const [view, setView] = useState<"workspace" | "history" | "settings">("workspace");
  const [keyConfigured, setKeyConfigured] = useState(openAIConfigured);
  const [customKeySaved, setCustomKeySaved] = useState(hasCustomOpenAIKey);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyMessage, setKeyMessage] = useState("");
  const [data, setData] = useState<WorkspaceData>({ version: 2, activeId: null, records: [] });
  const dataRef = useRef(data);
  const [deleteTarget, setDeleteTarget] = useState<string | "all" | null>(null);
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
      void flushSaves();
    };
  });

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
          const strings = Object.fromEntries(Object.entries(empty).filter(([, value]) => typeof value === "string").map(([field, value]) => [field, typeof values[field] === "string" ? values[field] : value]));
          const profiles = Array.isArray(values.profiles) ? values.profiles as Profile[] : [];
          const findings = Array.isArray(values.findings) ? values.findings as Finding[] : (values.source || values.research) ? [{ id: crypto.randomUUID(), source: typeof values.source === "string" ? values.source : "", date: "", observation: typeof values.research === "string" ? values.research : "", status: "" }] : [];
          const id = crypto.randomUUID();
          saved = JSON.stringify({ version: 2, activeId: id, records: [{ id, updatedAt: new Date().toISOString(), draft: { ...empty, ...strings, profiles, findings } }] });
          localStorage.setItem(key, saved);
        }
        const rawDirty = localStorage.getItem(dirtyKey);
        if (saved && rawDirty && rawDirty !== "{}") {
          const backup = JSON.parse(saved) as WorkspaceData;
          const dirtyMap = JSON.parse(rawDirty) as Record<string, string>;
          const remoteTyped = records.map(record => ({ ...record, draft: { ...empty, ...(record.draft as Draft) } }));
          const mergedMap = new Map<string, RecordEntry>(remoteTyped.map(record => [record.id, record]));
          for (const localRecord of backup.records ?? []) {
            const normalized: RecordEntry = { ...localRecord, draft: { ...empty, ...localRecord.draft } };
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
          setDraft(reconciled.records.find(item => item.id === activeId)?.draft ?? { ...empty });
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
            if (!existing.has(record.id)) await saveRecord(ownerId, record, true);
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
        const typed = records.map(record => ({ ...record, draft: { ...empty, ...(record.draft as Draft) } }));
        const activeId = typed[0]?.id ?? null;
        const next: WorkspaceData = { version: 2, activeId, records: typed };
        dataRef.current = next; setData(next); setDraft(typed[0]?.draft ?? { ...empty }); setReady(true);
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
      const nextDraft = { ...empty, [field]: value };
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
  function openRecord(id: string) {
    void flushSaves();
    const current = dataRef.current; const record = current.records.find(item => item.id === id);
    if (record && persist({ ...current, activeId: id })) { setDraft(record.draft); setView("workspace"); }
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
      setDraft(remaining.find(item => item.id === activeId)?.draft ?? { ...empty }); setDeleteTarget(null); setView("history");
    } catch { setStatus("Could not complete deletion in Supabase. Some screenshots may already have been deleted; please retry."); setDeleteTarget(null); }
  }
  function exportDraft() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "strategy-draft.json"; a.click(); URL.revokeObjectURL(url);
  }
  function createOutline() {
    const subject = draft.business.trim() || draft.name.trim() || "Client";
    update("strategy", `${draft.mode === "lead" ? "Lead Proposal" : "Client Strategy"} — ${subject}\n\nObjective\n${draft.goals.trim() || "Add the primary business objective."}\n\nAudience\n${draft.audience.trim() || "Describe the target audience."}\n\nOpportunities\n${draft.findings.filter(f => f.observation.trim()).map(f => `- ${f.observation.trim()}${f.status ? ` [${f.status}]` : ""}${f.source ? ` — ${f.source}` : ""}${f.date ? ` (${f.date})` : ""}`).join("\n") || "Review the research and identify opportunities."}\n\nRecommended Services\nAdd relevant services and explain how they support the objective.\n\n30 / 60 / 90 Day Roadmap\nDays 1–30: Foundation and planning\nDays 31–60: Launch and execution\nDays 61–90: Review and optimisation\n\nMeasurement\nDefine the baseline and appropriate KPIs.`);
  }
  return (
    <main id="main-content" className="strategy-page">
      <div className="strategy-shell"><h1 className="strategy-sr-only">Strategy Workspace</h1>{confirmOutline && <ConfirmOutline onCancel={() => setConfirmOutline(false)} onConfirm={() => { setConfirmOutline(false); createOutline(); }} />}<nav className="strategy-nav" aria-label="Workspace navigation"><button type="button" aria-current={view === "workspace" ? "page" : undefined} onClick={() => setView("workspace")}>Home</button><button type="button" aria-current={view === "history" ? "page" : undefined} onClick={() => setView("history")}>History</button><button type="button" aria-current={view === "settings" ? "page" : undefined} onClick={() => setView("settings")}>Settings</button><form action={logout}><button type="submit">Sign Out</button></form></nav>
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
            setKeyMessage(result.message);
          } catch {
            setKeyMessage("Could not save the API key. Please try again.");
          } finally {
            setKeyBusy(false);
          }
        }}><label>OpenAI API Key<input type="password" name="openaiApiKey" autoComplete="new-password" spellCheck={false} placeholder={keyConfigured ? "Enter a new key to replace the current key" : "sk-..."} value={apiKeyInput} disabled={keyBusy} onChange={e => setApiKeyInput(e.target.value)} /></label><div className="strategy-actions"><button className="strategy-button" type="submit" disabled={keyBusy || !apiKeyInput.trim()}>{keyBusy ? "Saving…" : keyConfigured ? "Update API Key" : "Save API Key"}</button>{customKeySaved && <button type="button" disabled={keyBusy} onClick={async () => {
          setKeyBusy(true);
          setKeyMessage("");
          try {
            const result = await removeOpenAIKey();
            setApiKeyInput("");
            setKeyConfigured(result.configured);
            setCustomKeySaved(result.hasCustomKey);
            setKeyMessage(result.message);
          } catch {
            setKeyMessage("Could not remove the saved API key.");
          } finally {
            setKeyBusy(false);
          }
        }}>Remove Saved Key</button>}</div>{keyMessage && <p className="settings-key-status" role="status">{keyMessage}</p>}</form></div></section>}
        {view === "workspace" && <>
        <fieldset className="strategy-modes" disabled={!ready}><legend>Choose a Strategy Type</legend>
          {[["lead", "Lead Proposal", "Develop an opportunity for a prospective client."], ["client", "Client Strategy", "Plan the work for an existing client."]].map(([value, title, description]) => <label className={`strategy-mode ${draft.mode === value ? "is-selected" : ""}`} key={value}><input type="radio" name="mode" checked={draft.mode === value} onChange={() => update("mode", value)} /><span><strong>{title}</strong><small>{description}</small></span></label>)}
        </fieldset>
        <section className="strategy-section"><div className="strategy-heading"><span>01 / THE BRIEF</span><h2>Client Brief<span>.</span></h2><p>Start with what you know. You can come back and add more later.</p></div>
          <div className="strategy-fields">
            <CustomSelect label="Business Type" value={draft.businessType} disabled={!ready} onChange={value => update("businessType", value)} options={[{ value: "", label: "Select a Business Type" }, ...(draft.businessType && !businessTypes.includes(draft.businessType) ? [{ value: draft.businessType, label: draft.businessType }] : []), ...businessTypes.map(type => ({ value: type, label: type.replace(/\b[a-z]/g, (letter, index) => index === 0 || !/^(and|or)$/.test(type.slice(index).split(" ")[0]) ? letter.toUpperCase() : letter) }))]} />
            {draft.businessType === "Other" && <label>Specify Business Type<input placeholder="Enter a business type or niche" value={draft.businessTypeOther} disabled={!ready} onChange={e => update("businessTypeOther", e.target.value)} /></label>}
            {([["name", "Client Name", "e.g. Elise Monroe"], ["business", "Business Name", "e.g. Elise Monroe, author"], ["website", "Website", "https://example.com"]] as const).map(([field, label, placeholder]) => <label key={field}>{label}<input type={field === "website" ? "url" : "text"} placeholder={placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} /></label>)}
            {([["about", "About the Business", "What does the business do and what makes it distinctive?"], ["audience", "Target Audience", "Who are they trying to reach?"], ["goals", "Goals", "What would they like to achieve?"], ["offerings", "Products or Services", "What does the business offer?"], ["challenges", "Marketing Challenges", "What obstacles are they facing?"], ["competitors", "Competitors", "Names and websites, one per line."], ["conversionGoal", "Conversion Goal", "For example: enquiries, bookings, sales or subscribers."]] as const).map(([field, label, placeholder]) => <label key={field}>{label}<textarea rows={4} placeholder={placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} /></label>)}
          </div>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>02 / SOCIAL PROFILES</span><h2>Social Profiles<span>.</span></h2><p>Add each account separately. All fields are optional.</p></div>
          <div className="strategy-records">{draft.profiles.map((profile, index) => <div className="strategy-record" key={profile.id}><div className="strategy-record-header"><h3>Profile {index + 1}</h3><button type="button" onClick={async () => { try { await flushSaves(); await deleteProfileCloud(ownerId, profile.id); update("profiles", draft.profiles.filter(item => item.id !== profile.id)); } catch { setStatus("Could not remove this profile’s screenshots. Please try again."); } }}>Remove Profile {index + 1}</button></div><div className="strategy-fields">
            <CustomSelect label="Platform" value={profile.platform} onChange={value => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, platform: value } : item))} options={[{ value: "", label: "Not Provided" }, ...["Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Threads", "X", "Other"].map(value => ({ value, label: value }))]} />
            <label>Profile URL<input type="url" placeholder="https://" value={profile.url} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, url: e.target.value } : item))} /></label>
            <label>Notes<textarea rows={3} value={profile.notes} onChange={e => update("profiles", draft.profiles.map(item => item.id === profile.id ? { ...item, notes: e.target.value } : item))} /></label>
            <CloudAttachments ownerId={ownerId} profileId={profile.id} profileNumber={index + 1} />
          </div></div>)}</div><button className="strategy-add" type="button" disabled={!ready} onClick={() => update("profiles", [...draft.profiles, { id: crypto.randomUUID(), platform: "", url: "", notes: "" }])}>Add Social Profile</button>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>03 / RESEARCH</span><h2>What Have You Found<span>?</span></h2><p>Record each finding with its source and context. Automatic research is not connected yet.</p></div>
          <div className="strategy-records">{draft.findings.map((finding, index) => <div className="strategy-record" key={finding.id}><div className="strategy-record-header"><h3>Finding {index + 1}</h3><button type="button" onClick={() => update("findings", draft.findings.filter(item => item.id !== finding.id))}>Remove Finding {index + 1}</button></div><div className="strategy-fields">
            <label>Source URL or Reference<input placeholder="Website, social profile, or document" value={finding.source} onChange={e => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, source: e.target.value } : item))} /></label>
            <div className="strategy-date-field"><label htmlFor={`date-${finding.id}`}>Date Observed</label><DatePicker id={`date-${finding.id}`} value={finding.date} onChange={date => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, date } : item))} /></div>
            <CustomSelect label="Finding Type" value={finding.status} onChange={value => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, status: value } : item))} options={[{ value: "", label: "Not Specified" }, { value: "observed", label: "Observed" }, { value: "client-provided", label: "Client-Provided" }, { value: "inferred", label: "Inferred" }]} />
            <label>Observation<textarea rows={4} placeholder="Describe the finding and any uncertainty." value={finding.observation} onChange={e => update("findings", draft.findings.map(item => item.id === finding.id ? { ...item, observation: e.target.value } : item))} /></label>
          </div></div>)}</div><button className="strategy-add" type="button" disabled={!ready} onClick={() => update("findings", [...draft.findings, { id: crypto.randomUUID(), source: "", date: "", observation: "", status: "" }])}>Add Finding</button>
        </section>
        <section className="strategy-section"><div className="strategy-heading"><span>04 / STRATEGY</span><h2>Make a Plan<span>.</span></h2><p>Create a starting outline from your brief, then edit it below. This outline is a template, not an AI-generated strategy.</p></div><button className="strategy-button" type="button" disabled={!ready} onClick={() => draft.strategy.trim() ? setConfirmOutline(true) : createOutline()}>Create Starting Outline</button><label className="strategy-editor">Strategy Draft<textarea rows={18} placeholder="Your editable strategy will appear here." value={draft.strategy} disabled={!ready} onChange={e => update("strategy", e.target.value)} /></label><div className="strategy-print"><h1>Strategy Draft</h1><pre>{draft.strategy}</pre></div><div className="strategy-actions"><button type="button" onClick={exportDraft} disabled={!ready}>Export Draft</button><button type="button" onClick={() => window.print()} disabled={!ready}>Print / Save PDF</button></div></section>
        </>}
      </div>
    </main>
  );
}
