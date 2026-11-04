"use client";

import { useFormStatus } from "react-dom";

export default function SignInButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-live="polite">{pending && <span className="login-spinner" aria-hidden="true" />}{pending ? "Signing in…" : "Sign In"}</button>;
}
