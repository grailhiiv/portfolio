"use client";
import { useEffect, useRef, useState } from "react";
import Cursor from "@/components/cursor";
export default function ConfirmDelete({ all, name, onCancel, onConfirm }: { all: boolean; name: string; onCancel: () => void; onConfirm: () => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => { if (element?.open) element.close(); }; }, []);
  return <dialog ref={dialog} className="strategy-dialog" aria-labelledby="delete-title" onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}><Cursor primary={false} /><h2 id="delete-title">{all ? "Delete All Workspace Data?" : "Delete This Record?"}</h2><p>{all ? "This permanently deletes all saved records and screenshots stored by this workspace in Supabase." : `This permanently deletes ${name} and its associated screenshots from Supabase.`} Exported files and older browser backups are not affected.</p><div className="strategy-dialog-actions"><button type="button" disabled={busy} autoFocus onClick={onCancel}>Cancel</button><button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); } }}>{busy ? "Deleting…" : "Delete"}</button></div></dialog>;
}
