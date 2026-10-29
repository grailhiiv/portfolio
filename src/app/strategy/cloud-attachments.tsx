"use client";
import { useEffect, useState } from "react";
import { listAttachments, uploadAttachment, deleteAttachmentPaths, downloadAttachment, type CloudAttachment } from "./cloud";
export default function CloudAttachments({ ownerId, profileId, profileNumber }: { ownerId: string; profileId: string; profileNumber: number }) {
  const [items, setItems] = useState<CloudAttachment[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setBusy(true); listAttachments(ownerId, profileId).then(files => { if (active) setItems(files); }).catch(() => { if (active) setError("Could not load screenshots from Supabase."); }).finally(() => { if (active) setBusy(false); }); return () => { active = false; }; }, [ownerId, profileId]);
  async function upload(files: File[]) {
    if (files.some(file => !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type) || file.size > 10 * 1024 * 1024)) { setError("Choose PNG, JPEG, WebP or GIF images up to 10 MB each."); return; }
    setBusy(true); setError("");
    try { for (const file of files) await uploadAttachment(ownerId, profileId, crypto.randomUUID(), file); setItems(await listAttachments(ownerId, profileId)); }
    catch { setError("Could not upload all screenshots. Check your connection and try again."); try { setItems(await listAttachments(ownerId, profileId)); } catch {} }
    finally { setBusy(false); }
  }
  return <div className="profile-attachments"><span className="profile-attachments-label">Screenshots</span><label className={`profile-attachments-button${busy ? " is-disabled" : ""}`} htmlFor={`screenshots-${profileId}`}>Attach Screenshots</label><input className="profile-attachments-input" id={`screenshots-${profileId}`} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={busy} onChange={event => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; if (files.length) void upload(files); }} /><p>PNG, JPEG, WebP or GIF, up to 10 MB per image. Stored privately in Supabase.</p>{error && <p role="alert" className="profile-attachments-error">{error}</p>}{items.length > 0 && <ul>{items.map(item => <li key={item.id}><button type="button" onClick={() => void downloadAttachment(item).catch(() => setError("Could not download this screenshot."))}>{item.name}</button><button type="button" disabled={busy} aria-label={`Remove ${item.name} from profile ${profileNumber}`} onClick={async () => { setBusy(true); try { await deleteAttachmentPaths([item.path]); setItems(current => current.filter(entry => entry.path !== item.path)); setError(""); } catch { setError("Could not remove this screenshot."); } finally { setBusy(false); } }}>Remove</button></li>)}</ul>}</div>;
}
