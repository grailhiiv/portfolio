"use client";

import { useEffect, useRef, useState } from "react";
import type { Draft } from "./model";

function PdfPage({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let destroy: (() => Promise<void>) | undefined;
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        const task = pdfjs.getDocument({ url });
        destroy = () => task.destroy();
        const document = await task.promise;
        const page = await document.getPage(1);
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        if (!cancelled) setError(false);
      } catch (cause) {
        console.error("PDF preview rendering failed:", cause);
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
      void destroy?.();
    };
  }, [url]);
  return (
    <>
      {error && (
        <p>Could not display this page. Try generating the PDF again.</p>
      )}
      <canvas ref={canvasRef} aria-hidden="true" />
    </>
  );
}

function EnlargedPreview({
  url,
  page,
  close,
}: {
  url: string;
  page: number;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="enlarged-preview"
      aria-labelledby="enlarged-preview-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="enlarged-preview-head">
        <strong id="enlarged-preview-title">
          Invoice preview · Page {page}
        </strong>
        <button type="button" onClick={close} autoFocus>
          Close
        </button>
      </div>
      <div className="enlarged-preview-content">
        <PdfPage url={url} />
      </div>
    </dialog>
  );
}

/** Render the same PDF that is downloaded, so page breaks cannot drift. */
export default function LivePdfPreview({ draft }: { draft: Draft }) {
  const [pages, setPages] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const [{ pdf }, { InvoiceDocument }, { PDFDocument }] =
          await Promise.all([
            import("@react-pdf/renderer"),
            import("./pdf"),
            import("pdf-lib"),
          ]);
        const blob = await pdf(<InvoiceDocument draft={draft} />).toBlob();
        const document = await PDFDocument.load(await blob.arrayBuffer());
        const images: string[] = [];
        try {
          for (let number = 0; number < document.getPageCount(); number++) {
            if (cancelled) break;
            const pageDocument = await PDFDocument.create();
            const [page] = await pageDocument.copyPages(document, [number]);
            pageDocument.addPage(page);
            const bytes = await pageDocument.save();
            images.push(
              URL.createObjectURL(
                new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
              ),
            );
          }
          if (!cancelled) {
            setPages(images);
            setSelectedPage((page) =>
              Math.min(page, Math.max(0, images.length - 1)),
            );
            setError(false);
          } else {
            images.forEach((url) => URL.revokeObjectURL(url));
          }
        } catch (error) {
          images.forEach((url) => URL.revokeObjectURL(url));
          throw error;
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [draft]);
  useEffect(
    () => () => pages.forEach((url) => URL.revokeObjectURL(url)),
    [pages],
  );
  const currentPage = Math.min(selectedPage, Math.max(0, pages.length - 1));
  return (
    <div>
      {!error && pages.length > 1 && (
        <nav className="preview-pagination" aria-label="Invoice preview pages">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setSelectedPage(currentPage - 1)}
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {currentPage + 1} of {pages.length}
          </span>
          <button
            type="button"
            disabled={currentPage === pages.length - 1}
            onClick={() => setSelectedPage(currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}
      <div className="live-pdf-pages">
        {error ? (
          <p>Preview unavailable. Use Generate Invoice to view the PDF.</p>
        ) : pages.length === 0 ? (
          <p>Preparing preview…</p>
        ) : (
          <div className="live-pdf-page">
            <PdfPage url={pages[currentPage]} />
            <button
              type="button"
              className="preview-magnify"
              aria-label={`Enlarge invoice preview page ${currentPage + 1}`}
              onClick={() => setExpanded(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5M10.5 7.5v6M7.5 10.5h6" />
              </svg>
            </button>
            {expanded && (
              <EnlargedPreview
                url={pages[currentPage]}
                page={currentPage + 1}
                close={() => setExpanded(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
