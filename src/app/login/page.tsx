import type { Metadata } from "next";
import { login } from "./actions";
import "../strategy/strategy.css";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main id="main-content" className="strategy-login"><div className="strategy-login-inner"><form action={login}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p role="alert">Unable to sign in. Check your email and password.</p>}<button type="submit">Sign in</button></form></div></main>;
}
