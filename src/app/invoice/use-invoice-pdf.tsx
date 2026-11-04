"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { calculate, type Draft } from "./model";
export function useInvoicePdf(
  addHistory: (draft: Draft) => void,
  setMessage: Dispatch<SetStateAction<string>>,
) {
  const [preview, setPreview] = useState<{
    url: string;
    filename: string;
    warnings: string[];
  } | null>(null);
  const [generating, setGenerating] = useState(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );
  const makePdf = async (source: Draft, record = true) => {
    setGenerating(true);
    try {
      const [{ pdf }, { InvoiceDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./pdf"),
      ]);
      const blob = await pdf(<InvoiceDocument draft={source} />).toBlob();
      const client =
        source.client
          .trim()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase() || "client";
      const digits = String(
        crypto.getRandomValues(new Uint32Array(1))[0],
      ).padStart(10, "0");
      const warnings = [
        !source.client.trim() && "Client name is missing.",
        !source.number.trim() && "Invoice number is missing.",
        !source.issued && "Issue date is missing.",
        !source.due && "Due date is missing.",
        source.lines.length === 0 && "No invoice items have been added.",
        calculate(source).unresolved &&
          "Quote-required items are excluded from the total.",
      ].filter((x): x is string => Boolean(x));
      if (record) {
        addHistory(source);
      }
      setPreview({
        url: URL.createObjectURL(blob),
        filename: `invoice-${client}-${digits}.pdf`,
        warnings,
      });
    } catch {
      setMessage("Could not generate the PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };
  return { preview, setPreview, generating, makePdf };
}
