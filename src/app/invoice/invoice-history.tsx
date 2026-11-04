import type { Draft } from "./model";
import type { HistoryEntry } from "./use-invoice-history";

export default function InvoiceHistory({
  history,
  generating,
  makePdf,
  deleteHistory,
}: {
  history: HistoryEntry[];
  generating: boolean;
  makePdf: (draft: Draft, record?: boolean) => Promise<void>;
  deleteHistory: (id?: string) => void;
}) {
  return (
    <section className="invoice-history">
      <div className="section-heading">
        <h2>
          History<span>.</span>
        </h2>
      </div>
      <div className="invoice-history-list">
        {history.length === 0 ? (
          <p>No generated invoices yet.</p>
        ) : (
          history.map((entry) => (
            <article className="invoice-history-record" key={entry.id}>
              <div>
                <h3>{entry.draft.client || "Unnamed client"}</h3>
                <p>
                  {entry.draft.number || "No invoice number"} · Generated{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="invoice-history-actions">
                <button
                  type="button"
                  disabled={generating}
                  onClick={() => void makePdf(entry.draft, false)}
                >
                  View PDF
                </button>
                <button type="button" onClick={() => deleteHistory(entry.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
      <button
        className="invoice-history-delete-all"
        type="button"
        disabled={history.length === 0}
        onClick={() => deleteHistory()}
      >
        Delete All History
      </button>
    </section>
  );
}
