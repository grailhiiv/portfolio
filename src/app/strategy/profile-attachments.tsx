"use client";

import { useEffect, useState } from "react";

export type Attachment = { id: string; file: File };
const dbName = "grailhiiv-strategy-attachments";
const storeName = "profiles";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Storage is unavailable."));
  });
}

export async function readAttachments(profileId: string): Promise<Attachment[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(profileId);
    transaction.oncomplete = () => { db.close(); resolve(Array.isArray(request.result) ? request.result : []); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

async function saveAttachments(profileId: string, attachments: Attachment[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(attachments, profileId);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

export async function deleteAttachments(profileIds: string[] | null): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    if (profileIds === null) store.clear();
    else profileIds.forEach(id => store.delete(id));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
export async function deleteProfileAttachments(profileId: string): Promise<void> {
  return deleteAttachments([profileId]);
}

export function ProfileAttachments({ profileId, profileNumber }: { profileId: string; profileNumber: number }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    readAttachments(profileId).then(items => { if (active) { setAttachments(items); setReady(true); } }).catch(() => { if (active) setError("Could not load attachments from this browser."); });
    return () => { active = false; };
  }, [profileId]);

  async function replace(items: Attachment[]) {
    setBusy(true);
    try { await saveAttachments(profileId, items); setAttachments(items); setError(""); }
    catch { setError("Could not save attachments. Check your browser storage and try again."); }
    finally { setBusy(false); }
  }

  function download(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a"); link.href = url; link.download = file.name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="profile-attachments">
    <span className="profile-attachments-label">Screenshots</span>
    <label className={`profile-attachments-button${!ready || busy ? " is-disabled" : ""}`} htmlFor={`screenshots-${profileId}`}>Attach Screenshots</label>
    <input className="profile-attachments-input" id={`screenshots-${profileId}`} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={!ready || busy} onChange={event => {
      const files = Array.from(event.currentTarget.files ?? []);
      event.currentTarget.value = "";
      if (files.some(file => !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type) || file.size > 10 * 1024 * 1024)) { setError("Choose PNG, JPEG, WebP or GIF images up to 10 MB each."); return; }
      if (files.length) void replace([...attachments, ...files.map(file => ({ id: crypto.randomUUID(), file }))]);
    }} />
    <p>PNG, JPEG, WebP or GIF, up to 10 MB per image. Saved in this browser.</p>
    {error && <p role="alert" className="profile-attachments-error">{error}</p>}
    {attachments.length > 0 && <ul>{attachments.map(attachment => <li key={attachment.id}><button type="button" onClick={() => download(attachment.file)}>{attachment.file.name}</button><button type="button" disabled={busy} aria-label={`Remove ${attachment.file.name} from profile ${profileNumber}`} onClick={() => void replace(attachments.filter(item => item.id !== attachment.id))}>Remove</button></li>)}</ul>}
  </div>;
}
