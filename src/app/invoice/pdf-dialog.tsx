"use client";
import { useEffect, useRef } from "react";

export default function PdfDialog({
  preview,
  close,
}: {
  preview: { url: string; filename: string; warnings: string[] };
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="pdf-dialog"
      aria-labelledby="pdf-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="pdf-dialog-head">
        <strong id="pdf-dialog-title">Invoice PDF preview</strong>
        <div>
          <a href={preview.url} download={preview.filename}>
            Download PDF
          </a>
          <button autoFocus onClick={close}>
            Close
          </button>
        </div>
      </div>
      {preview.warnings.length > 0 && (
        <div className="pdf-warnings">
          <strong>Review before sending</strong>
          <ul>
            {preview.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <iframe title="Invoice PDF preview" src={preview.url} />
    </dialog>
  );
}
