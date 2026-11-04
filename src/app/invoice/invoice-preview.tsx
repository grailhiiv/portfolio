import LivePdfPreview from "./live-pdf-preview";
import { calculate, type Draft } from "./model";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0,
  );
export default function InvoicePreview({
  draft,
  hasPaymentErrors,
  generating,
  requestPdf,
}: {
  draft: Draft;
  hasPaymentErrors: boolean;
  generating: boolean;
  requestPdf: () => void;
}) {
  const {
    lineTotal,
    oneTime,
    monthly,
    discount,
    tax,
    total,
    balance,
    unresolved,
  } = calculate(draft);
  return (
    <aside
      id="live-preview"
      className="invoice-preview"
      aria-label="Live invoice preview"
    >
      {hasPaymentErrors && (
        <p className="preview-error" role="status">
          Resolve the payment errors before generating the invoice. Totals shown
          in the preview are provisional.
        </p>
      )}
      <LivePdfPreview draft={draft} />
      <div className="invoice-sr-only">
        <div className="preview-top">
          <div className="preview-brand">
            <img src="/images/grailhiiv-logo.svg" alt="" />
            <strong>GRAILHIIV</strong>
          </div>
          <span>
            social@grailhiiv.com
            <br />
            grailhiiv.com
          </span>
        </div>
        <h2>
          Invoice<span>.</span>
        </h2>
        <div className="preview-meta">
          <div>
            <small>BILL TO</small>
            <strong>{draft.client || "Client name"}</strong>
            <p>
              {draft.email}
              <br />
              {draft.address}
            </p>
          </div>
          <div>
            <p>
              <b>Invoice</b> {draft.number || "—"}
            </p>
            <p>
              <b>Issued</b> {draft.issued || "—"}
            </p>
            <p>
              <b>Due</b> {draft.due || "—"}
            </p>
          </div>
        </div>
        <div className="preview-lines">
          {draft.lines.length === 0 && (
            <p className="empty">Your selected services will appear here.</p>
          )}
          <table>
            <caption>Invoice line items</caption>
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Quantity</th>
                <th scope="col">Rate</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {draft.lines.map((line) => (
                <tr key={line.id}>
                  <td>
                    <strong>{line.name || "Untitled item"}</strong>
                    <small>{line.scope}</small>
                    <small>
                      {line.frequency === "monthly" && line.unit === "month"
                        ? "Monthly"
                        : `${line.frequency === "monthly" ? "Monthly" : "One-time"} / ${line.unit}`}
                      {line.clientDirect
                        ? " · Client pays provider directly; excluded from totals"
                        : ""}
                    </small>
                  </td>
                  <td>{line.quantity}</td>
                  <td>{line.price === null ? "Quote" : money(line.price)}</td>
                  <td>
                    {line.price === null ? "Quote" : money(lineTotal(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="totals">
          <div>
            <span>One-time charges</span>
            <span>{money(oneTime)}</span>
          </div>
          <div>
            <span>Monthly charges (this invoice)</span>
            <span>{money(monthly)}</span>
          </div>
          {discount > 0 && (
            <div>
              <span>Discount</span>
              <span>−{money(discount)}</span>
            </div>
          )}
          {draft.tax > 0 && (
            <div>
              <span>Tax ({draft.tax}%)</span>
              <span>{money(tax)}</span>
            </div>
          )}
          <div>
            <span>Invoice total</span>
            <span>{money(total)}</span>
          </div>
          <div>
            <span>
              Payment received
              {draft.paymentDate ? ` (${draft.paymentDate})` : ""}
            </span>
            <span>−{money(draft.paid)}</span>
          </div>
          <div className="due">
            <strong>Amount due</strong>
            <strong>{money(balance)}</strong>
          </div>
        </div>
        {unresolved && (
          <p className="preview-note">
            Quote required items are excluded from totals until priced.
          </p>
        )}
        {monthly > 0 && (
          <p className="preview-note">
            Recurring service: {money(monthly)} per month before future
            adjustments. {draft.period && `Billing period: ${draft.period}. `}
            {draft.next && `Next billing date: ${draft.next}.`} No automatic
            payment is implied.
          </p>
        )}
        {draft.instructions && (
          <div className="preview-notes">
            <small>PAYMENT INSTRUCTIONS</small>
            <p>{draft.instructions}</p>
          </div>
        )}
        {draft.notes && (
          <div className="preview-notes">
            <small>NOTES</small>
            <p>{draft.notes}</p>
          </div>
        )}
        <div className="preview-footer">Thank you for your business.</div>
      </div>
      <div className="invoice-actions invoice-mobile-download">
        <button className="primary" onClick={requestPdf} disabled={generating}>
          {generating ? "Generating PDF…" : "Generate Invoice"}
        </button>
      </div>
    </aside>
  );
}
