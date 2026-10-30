"use client";
import { useEffect, useRef } from "react";
import Cursor from "@/components/cursor";
export default function ConfirmOutline({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => { if (dialog?.open) dialog.close(); }; }, []);
  return <dialog ref={ref} className="strategy-dialog" aria-labelledby="replace-title" onCancel={event => { event.preventDefault(); onCancel(); }}><Cursor primary={false} /><h2 id="replace-title">Replace Strategy Draft?</h2><p>Your current draft will be replaced. Copy it first if you want to keep a copy.</p><div className="strategy-dialog-actions"><button type="button" autoFocus onClick={onCancel}>Cancel</button><button type="button" onClick={onConfirm}>Replace Draft</button></div></dialog>;
}
