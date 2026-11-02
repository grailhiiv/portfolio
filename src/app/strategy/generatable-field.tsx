"use client";

import type { ChangeEvent } from "react";

export function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path className="spark-star-main" d="M10.5 2.5C11.1 7.2 12.8 8.9 17.5 9.5C12.8 10.1 11.1 11.8 10.5 16.5C9.9 11.8 8.2 10.1 3.5 9.5C8.2 8.9 9.9 7.2 10.5 2.5Z" />
      <path className="spark-star-top" d="M18.5 2C18.8 4.1 19.6 4.9 21.7 5.2C19.6 5.5 18.8 6.3 18.5 8.4C18.2 6.3 17.4 5.5 15.3 5.2C17.4 4.9 18.2 4.1 18.5 2Z" />
      <path className="spark-star-bottom" d="M17.5 14C17.8 16.1 18.6 16.9 20.7 17.2C18.6 17.5 17.8 18.3 17.5 20.4C17.2 18.3 16.4 17.5 14.3 17.2C16.4 16.9 17.2 16.1 17.5 14Z" />
    </svg>
  );
}


type GeneratableFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  loading: boolean;
  disabled: boolean;
  generationDisabled: boolean;
  onChange: (value: string) => void;
  onGenerate: () => void;
};

export default function GeneratableField({ id, label, value, placeholder, multiline = false, rows = 3, loading, disabled, generationDisabled, onChange, onGenerate }: GeneratableFieldProps) {
  const fieldProps = {
    id,
    placeholder: loading && !value ? "Generating…" : placeholder,
    value,
    disabled,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
  };
  return (
    <div className="strategy-field">
      <label htmlFor={id}>{label}</label>
      <div className={`strategy-input-wrap is-${multiline ? "textarea" : "input"} ${loading ? "is-loading" : ""}`}>
        {multiline ? <textarea {...fieldProps} rows={rows} /> : <input {...fieldProps} type="text" />}
        <button type="button" className={`strategy-spark-btn ${loading ? "is-loading" : ""}`} title={`Generate ${label}`} aria-label={`Generate ${label}`} disabled={generationDisabled} onClick={onGenerate}>
          <SparkIcon />
        </button>
      </div>
    </div>
  );
}
