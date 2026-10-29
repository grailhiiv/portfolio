"use client";
import { useEffect, useId, useRef, useState } from "react";
type Option = { value: string; label: string };
export default function CustomSelect({ label, value, options, onChange, disabled = false }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const chosen = options.find(option => option.value === value);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function openMenu() { setActive(Math.max(0, options.findIndex(option => option.value === value))); setOpen(true); }
  return <div className="custom-select-field" ref={root}><span id={`${id}-label`}>{label}</span><button ref={trigger} type="button" className="custom-select-trigger" disabled={disabled} aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-${active}` : undefined} onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); }
    else if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (!open) openMenu(); else setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length); }
    else if (open && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onChange(options[active].value); setOpen(false); }
    else if (event.key === "Tab") setOpen(false);
  }}><span id={`${id}-value`}>{chosen?.label ?? value}</span><span className="custom-select-chevron" aria-hidden="true" /></button>
  {open && <div id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="custom-select-options">{options.map((option, index) => <div key={option.value} id={`${id}-${index}`} role="option" aria-selected={option.value === value} className={index === active ? "is-active" : ""} onMouseEnter={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); trigger.current?.focus(); }}>{option.label}</div>)}</div>}</div>;
}
