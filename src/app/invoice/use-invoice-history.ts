"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Draft } from "./model";
export type HistoryEntry = { id: string; createdAt: string; draft: Draft };
export function useInvoiceHistory(
  ownerId: string,
  setMessage: Dispatch<SetStateAction<string>>,
) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyKey = `invoice-history:${ownerId}`;
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(historyKey) || "[]");
      if (Array.isArray(data)) setHistory(data);
    } catch {
      setMessage("Invoice history could not be read in this browser.");
    }
  }, [historyKey, setMessage]);
  const addHistory = (draft: Draft) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      draft,
    };
    const next = [entry, ...history];
    try {
      localStorage.setItem(historyKey, JSON.stringify(next));
      setHistory(next);
      setMessage("");
    } catch {
      setMessage(
        "PDF generated, but it could not be saved to this browser’s invoice history.",
      );
    }
  };
  const deleteHistory = (id?: string) => {
    if (
      !window.confirm(
        id
          ? "Delete this invoice from history?"
          : "Delete all invoice history from this browser?",
      )
    )
      return;
    const next = id ? history.filter((item) => item.id !== id) : [];
    try {
      localStorage.setItem(historyKey, JSON.stringify(next));
      setHistory(next);
      setMessage(
        id ? "Invoice removed from history." : "Invoice history deleted.",
      );
    } catch {
      setMessage("Could not delete invoice history from this browser.");
    }
  };
  return { history, addHistory, deleteHistory };
}
