"use client";
import { useEffect, useState } from "react";
import PdfDialog from "./pdf-dialog";
import InvoiceHistory from "./invoice-history";
import { useInvoiceHistory } from "./use-invoice-history";
import { useInvoicePdf } from "./use-invoice-pdf";
import { catalogue, categories, type Item } from "./catalogue";
import { calculate, validatePayments, type Line, type Draft } from "./model";
import { logout } from "../login/actions";
import InvoicePreview from "./invoice-preview";

const countryCodes =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countries = countryCodes
  .map((code) => countryNames.of(code) || code)
  .sort((a, b) => a.localeCompare(b));
const uid = () => crypto.randomUUID();
const localDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const dueAfter14Days = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day + 14));
  return result.toISOString().slice(0, 10);
};
const blank = (): Draft => ({
  id: uid(),
  number: "",
  client: "",
  email: "",
  address: "",
  issued: "",
  due: "",
  period: "",
  next: "",
  lines: [],
  discount: 0,
  tax: 0,
  paid: 0,
  request: "",
  paymentDate: "",
  instructions: "",
  notes: "",
});
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0,
  );
const num = (s: string) => Math.max(0, Number(s) || 0);
export default function InvoiceWorkspace({ ownerId }: { ownerId: string }) {
  const [view, setView] = useState<"invoice" | "history">("invoice");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [invoiceSuffix, setInvoiceSuffix] = useState("");
  const [numberEdited, setNumberEdited] = useState(false);
  const [dueEdited, setDueEdited] = useState(false);
  const [addressParts, setAddressParts] = useState({
    street: "",
    city: "",
    region: "",
    postal: "",
    country: "",
  });
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [reviewRequested, setReviewRequested] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [ready, setReady] = useState(false);
  const { history, addHistory, deleteHistory } = useInvoiceHistory(ownerId, setMessage);
  const { preview, setPreview, generating, makePdf } = useInvoicePdf(addHistory, setMessage);
  useEffect(() => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear()).slice(-2)}`;
    const random = String(
      crypto.getRandomValues(new Uint32Array(1))[0] % 100,
    ).padStart(2, "0");
    setInvoiceSuffix(`${date}-${random}`);
    const issued = localDate(now);
    setDraft({ ...blank(), issued, due: dueAfter14Days(issued) });
    setReady(true);
  }, []);
  if (!draft || !ready)
    return <main className="invoice-page">Loading invoice workspace…</main>;
  const update = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  const updateLine = (id: string, patch: Partial<Line>) =>
    update({
      lines: draft.lines.map((line) =>
        line.id === id ? { ...line, ...patch } : line,
      ),
    });
  const updateAddress = (key: keyof typeof addressParts, value: string) => {
    const parts = { ...addressParts, [key]: value };
    setAddressParts(parts);
    update({
      address: [
        parts.street.trim(),
        [parts.city.trim(), parts.region.trim()].filter(Boolean).join(", "),
        parts.postal.trim(),
        parts.country.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };
  const add = (item: Item) => {
    update({
      lines: [
        ...draft.lines,
        {
          ...item,
          id: uid(),
          quantity: 1,
          clientDirect: false,
        },
      ],
    });
    setAddedMessage(`${item.name} added.`);
  };
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
  const paymentErrors = validatePayments(draft);
  const warnings = [
    !draft.client.trim() && {
      text: "Add a client name.",
      target: "client-name",
    },
    !draft.number.trim() && {
      text: "Add an invoice number.",
      target: "invoice-number",
    },
    !draft.issued && { text: "Add an issue date.", target: "issued" },
    !draft.due && { text: "Add a due date.", target: "due" },
    draft.lines.length === 0 && {
      text: "Add at least one invoice item.",
      target: "services",
    },
    unresolved && {
      text: "Set the agreed price for each unpriced item.",
      target: "line-items",
    },
  ].filter((item): item is { text: string; target: string } => Boolean(item));
  const hasPaymentErrors = Object.values(paymentErrors).some(Boolean);
  const requestPdf = () => {
    if (warnings.length || hasPaymentErrors) {
      setReviewRequested(true);
      window.setTimeout(
        () => document.getElementById("invoice-review")?.focus(),
        0,
      );
      return;
    }
    void makePdf(draft);
  };
  return (
    <main id="main-content" className="invoice-page">
      <div className="invoice-shell">
        <nav
          className="invoice-workspace-nav"
          aria-label="Workspace navigation"
        >
          <a href="/strategy">Strategy</a>
          <button
            type="button"
            aria-current={view === "invoice" ? "page" : undefined}
            onClick={() => setView("invoice")}
          >
            Invoice
          </button>
          <button
            type="button"
            aria-current={view === "history" ? "page" : undefined}
            onClick={() => setView("history")}
          >
            History
          </button>
          <form action={logout}>
            <button type="submit">Sign Out</button>
          </form>
        </nav>

        {preview && (
          <PdfDialog preview={preview} close={() => setPreview(null)} />
        )}
        {message && (
          <p className="invoice-message" role="status">
            {message}
          </p>
        )}
        {view === "invoice" && (
          <>
            <div className="invoice-title">
              <div>
                <h1>
                  Generate <span>Invoice.</span>
                </h1>
              </div>
              <div className="invoice-actions">
                <button
                  className="primary"
                  onClick={requestPdf}
                  disabled={generating}
                >
                  {generating ? "Generating PDF…" : "Generate Invoice"}
                </button>
              </div>
            </div>
            {reviewRequested && (warnings.length > 0 || hasPaymentErrors) && (
              <div
                id="invoice-review"
                className="invoice-review"
                tabIndex={-1}
                role="region"
                aria-labelledby="invoice-review-title"
              >
                <div className="invoice-review-head">
                  <strong id="invoice-review-title">Review your invoice</strong>
                  <button
                    type="button"
                    aria-label="Close invoice review"
                    onClick={() => setReviewRequested(false)}
                  >
                    ×
                  </button>
                </div>
                <p>Complete these details before sending your invoice.</p>
                <ul>
                  {warnings.map((warning) => (
                    <li key={warning.target}>
                      <a href={`#${warning.target}`}>{warning.text}</a>
                    </li>
                  ))}
                  {Object.entries(paymentErrors)
                    .filter(([, error]) => error)
                    .map(([field, error]) => (
                      <li key={field}>
                        <a href={`#${field}`}>{error}</a>
                      </li>
                    ))}
                </ul>
                {!hasPaymentErrors && (
                  <button
                    className="secondary"
                    disabled={generating}
                    onClick={() => void makePdf(draft)}
                  >
                    Generate draft PDF anyway
                  </button>
                )}
              </div>
            )}
            <div className="invoice-layout">
              <div className="invoice-form">
                <section>
                  <div className="section-heading">
                    <h2>Client details</h2>
                  </div>
                  <div className="fields grid-two">
                    <div className="invoice-name-fields">
                      <label>
                        First Name
                        <input
                          id="client-name"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFirstName(value);
                            update({
                              client: [value.trim(), lastName.trim()]
                                .filter(Boolean)
                                .join(" "),
                            });
                          }}
                        />
                      </label>
                      <label>
                        Last Name
                        <input
                          autoComplete="family-name"
                          value={lastName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setLastName(value);
                            update({
                              client: [firstName.trim(), value.trim()]
                                .filter(Boolean)
                                .join(" "),
                              ...(!numberEdited
                                ? {
                                    number: value.trim()
                                      ? `${value.trim().toUpperCase()}-${invoiceSuffix}`
                                      : "",
                                  }
                                : {}),
                            });
                          }}
                        />
                      </label>
                    </div>
                    <label className="invoice-email">
                      Email Address
                      <input
                        type="email"
                        value={draft.email}
                        onChange={(e) => update({ email: e.target.value })}
                      />
                    </label>
                    <fieldset className="invoice-address">
                      <legend>Address</legend>
                      <label>
                        <span className="invoice-sr-only">Address Line 1</span>
                        <input
                          autoComplete="address-line1"
                          value={addressParts.street}
                          onChange={(e) =>
                            updateAddress("street", e.target.value)
                          }
                        />
                      </label>
                      <div className="invoice-address-grid">
                        <label>
                          City
                          <input
                            autoComplete="address-level2"
                            value={addressParts.city}
                            onChange={(e) =>
                              updateAddress("city", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          State / Province / Region
                          <input
                            autoComplete="address-level1"
                            value={addressParts.region}
                            onChange={(e) =>
                              updateAddress("region", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Postal Code
                          <input
                            autoComplete="postal-code"
                            value={addressParts.postal}
                            onChange={(e) =>
                              updateAddress("postal", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Country
                          <select
                            autoComplete="country-name"
                            value={addressParts.country}
                            onChange={(e) =>
                              updateAddress("country", e.target.value)
                            }
                          >
                            <option value="">Select country</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </fieldset>
                    <label>
                      Invoice number
                      <input
                        id="invoice-number"
                        value={draft.number}
                        onChange={(e) => {
                          setNumberEdited(true);
                          update({ number: e.target.value });
                        }}
                      />
                    </label>
                    <label>
                      Issue date
                      <input
                        id="issued"
                        type="date"
                        value={draft.issued}
                        onChange={(e) =>
                          update({
                            issued: e.target.value,
                            ...(!dueEdited
                              ? { due: dueAfter14Days(e.target.value) }
                              : {}),
                          })
                        }
                      />
                    </label>
                    <label>
                      Due date
                      <input
                        id="due"
                        type="date"
                        value={draft.due}
                        onChange={(e) => {
                          setDueEdited(true);
                          update({ due: e.target.value });
                        }}
                      />
                    </label>
                    {draft.lines.some(
                      (line) => line.frequency === "monthly",
                    ) && (
                      <>
                        <label>
                          Billing period (optional)
                          <input
                            id="period"
                            placeholder="e.g. November 1–30, 2026"
                            value={draft.period}
                            onChange={(e) => update({ period: e.target.value })}
                          />
                        </label>
                        <label>
                          Next billing date (optional)
                          <input
                            id="next"
                            type="date"
                            value={draft.next}
                            onChange={(e) => update({ next: e.target.value })}
                          />
                        </label>
                      </>
                    )}
                  </div>
                </section>
                <section id="services" tabIndex={-1}>
                  <div className="section-heading">
                    <h2>Services details</h2>
                  </div>
                  <div className="catalogue">
                    <div className="fields grid-two">
                      <label>
                        Category
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {categories.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Search catalogue
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search items"
                        />
                      </label>
                    </div>
                    <div className="catalogue-list">
                      {catalogue
                        .filter(
                          (x) =>
                            x.category === category &&
                            `${x.name} ${x.scope}`
                              .toLowerCase()
                              .includes(query.toLowerCase()),
                        )
                        .map((item, i) => (
                          <div
                            className="catalogue-item"
                            key={`${item.name}-${i}`}
                          >
                            <div>
                              <strong>{item.name}</strong>
                              <small>{item.scope}</small>
                              <small>
                                {item.price === null
                                  ? "Quote required"
                                  : `${item.starting ? "From " : ""}${money(item.price)} / ${item.unit}`}
                              </small>
                            </div>
                            <button
                              aria-label={`Add ${item.name}`}
                              onClick={() => add(item)}
                            >
                              Add +
                            </button>
                          </div>
                        ))}
                      {!catalogue.some(
                        (x) =>
                          x.category === category &&
                          `${x.name} ${x.scope}`
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                      ) && (
                        <p className="catalogue-empty">
                          No matching services in this category.{" "}
                          <button type="button" onClick={() => setQuery("")}>
                            Clear search
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="catalogue-feedback" role="status">
                    {addedMessage}
                    {draft.lines.length > 0 &&
                      ` ${draft.lines.length} item${draft.lines.length === 1 ? "" : "s"} selected.`}
                  </p>
                  <div className="line-list" id="line-items" tabIndex={-1}>
                    {draft.lines.map((line, index) => (
                      <div className="line-card" key={line.id}>
                        <div className="line-head">
                          <strong>
                            Item {String(index + 1).padStart(2, "0")}
                          </strong>
                          <button
                            onClick={() =>
                              update({
                                lines: draft.lines.filter(
                                  (x) => x.id !== line.id,
                                ),
                              })
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <div className="fields">
                          <label>
                            Item name
                            <input
                              value={line.name}
                              onChange={(e) =>
                                updateLine(line.id, { name: e.target.value })
                              }
                            />
                          </label>
                          <label>
                            Description
                            <textarea
                              rows={2}
                              value={line.scope}
                              onChange={(e) =>
                                updateLine(line.id, { scope: e.target.value })
                              }
                            />
                          </label>
                          <div className="grid-three">
                            <label>
                              Quantity
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={line.quantity}
                                onChange={(e) =>
                                  updateLine(line.id, {
                                    quantity: num(e.target.value),
                                  })
                                }
                              />
                            </label>
                            <label>
                              Unit price (USD)
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Quote required"
                                value={line.price ?? ""}
                                onChange={(e) =>
                                  updateLine(line.id, {
                                    price:
                                      e.target.value === ""
                                        ? null
                                        : num(e.target.value),
                                  })
                                }
                              />
                              {line.starting && line.price === null && (
                                <small>
                                  Enter the agreed price for this starting-price
                                  service.
                                </small>
                              )}
                            </label>
                            <label>
                              Frequency
                              <select
                                value={line.frequency}
                                onChange={(e) =>
                                  updateLine(line.id, {
                                    frequency: e.target
                                      .value as Line["frequency"],
                                  })
                                }
                              >
                                <option value="one-time">One-time</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </label>
                          </div>
                          <label>
                            Unit
                            <input
                              value={line.unit}
                              onChange={(e) =>
                                updateLine(line.id, { unit: e.target.value })
                              }
                            />
                          </label>
                          {line.expense && (
                            <label className="check">
                              <input
                                type="checkbox"
                                checked={line.clientDirect}
                                onChange={(e) =>
                                  updateLine(line.id, {
                                    clientDirect: e.target.checked,
                                  })
                                }
                              />{" "}
                              Client pays provider directly
                            </label>
                          )}
                          <div className="line-total">
                            {line.price === null
                              ? "Quote required"
                              : money(lineTotal(line))}
                            {line.clientDirect && " · paid directly"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="secondary add-custom"
                    onClick={() =>
                      add({
                        category: "General",
                        name: "Custom service",
                        price: null,
                        unit: "project",
                        frequency: "one-time",
                        scope: "",
                      })
                    }
                  >
                    + Add custom item
                  </button>
                </section>
                <section>
                  <div className="section-heading">
                    <h2>Payment & notes</h2>
                  </div>
                  <div className="fields">
                    <div className="grid-two">
                      <label>
                        Payment received (USD)
                        <input
                          id="paid"
                          type="number"
                          min="0"
                          step="0.01"
                          value={draft.paid}
                          aria-invalid={!!paymentErrors.paid}
                          aria-describedby={
                            paymentErrors.paid ? "paid-error" : undefined
                          }
                          onChange={(e) =>
                            update({ paid: num(e.target.value) })
                          }
                        />
                        {paymentErrors.paid && (
                          <small id="paid-error" className="field-error">
                            {paymentErrors.paid}
                          </small>
                        )}
                      </label>
                      <label>
                        Payment date
                        <input
                          type="date"
                          value={draft.paymentDate}
                          onChange={(e) =>
                            update({ paymentDate: e.target.value })
                          }
                        />
                      </label>
                    </div>
                    <p className="invoice-amount-due">
                      Amount due: <strong>{money(balance)}</strong>
                    </p>
                    <button
                      className="secondary"
                      onClick={() => {
                        if (unresolved) {
                          setMessage(
                            "Set prices for quote-required items before marking the invoice paid.",
                          );
                          return;
                        }
                        const now = new Date();
                        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                        update({ paid: total, paymentDate: date, request: "" });
                        setMessage("Invoice marked paid.");
                      }}
                    >
                      Mark invoice as paid
                    </button>
                    <label>
                      Payment instructions
                      <textarea
                        rows={3}
                        value={draft.instructions}
                        onChange={(e) =>
                          update({ instructions: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Notes
                      <textarea
                        rows={3}
                        value={draft.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                      />
                    </label>
                  </div>
                </section>
              </div>
              <InvoicePreview draft={draft} hasPaymentErrors={hasPaymentErrors} generating={generating} requestPdf={requestPdf} />
            </div>
            <div className="invoice-mobile-bar">
              <a href="#live-preview">View preview</a>
              <button
                className="primary"
                onClick={requestPdf}
                disabled={generating}
              >
                {generating ? "Generating PDF…" : "Generate Invoice"}
              </button>
            </div>
          </>
        )}
        {view === "history" && <InvoiceHistory history={history} generating={generating} makePdf={makePdf} deleteHistory={deleteHistory} />}
      </div>
    </main>
  );
}
