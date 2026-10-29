"use client";

import { useEffect, useRef, useState } from "react";

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : null;
}
function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DatePicker({ value, onChange, id }: { value: string; onChange: (value: string) => void; id: string }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => { const date = parseDate(value) ?? new Date(); return new Date(date.getFullYear(), date.getMonth(), 1); });
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = parseDate(value);
  const today = dateValue(new Date());
  const firstDay = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", escape); };
  }, [open]);

  function choose(date: Date | null) { onChange(date ? dateValue(date) : ""); setOpen(false); trigger.current?.focus(); }
  function shift(delta: number) { setMonth(current => new Date(current.getFullYear(), current.getMonth() + delta, 1)); }
  return <div className="date-picker" ref={container}>
    <button ref={trigger} id={id} type="button" className="date-picker-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-calendar`} onClick={() => { if (!open) { const date = selected ?? new Date(); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); } setOpen(!open); }}>
      <span className={selected ? "" : "date-picker-placeholder"}>{selected ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(selected) : "Select a date"}</span>
    </button>
    {open && <div id={`${id}-calendar`} className="date-picker-popup" role="dialog" aria-label="Choose date observed">
      <div className="date-picker-header"><strong aria-live="polite">{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}</strong><div><button type="button" aria-label="Previous month" onClick={() => shift(-1)}>Previous</button><button type="button" aria-label="Next month" onClick={() => shift(1)}>Next</button></div></div>
      <div className="date-picker-grid">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span className="date-picker-weekday" key={day}>{day}</span>)}{Array.from({ length: firstDay }, (_, i) => <span key={`blank-${i}`} />)}{Array.from({ length: days }, (_, i) => { const date = new Date(month.getFullYear(), month.getMonth(), i + 1); const current = dateValue(date); return <button type="button" key={current} className={`${current === value ? "is-selected" : ""} ${current === today ? "is-today" : ""}`} aria-label={new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date)} aria-pressed={current === value} onClick={() => choose(date)}>{i + 1}</button>; })}</div>
      <div className="date-picker-actions"><button type="button" onClick={() => choose(null)}>Clear</button><button type="button" onClick={() => choose(new Date())}>Today</button></div>
    </div>}
  </div>;
}
