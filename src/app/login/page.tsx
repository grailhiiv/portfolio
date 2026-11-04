import type { Metadata } from "next";
import Image from "next/image";
import { login } from "./actions";
import SignInButton from "./sign-in-button";
import "../strategy/strategy.css";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main id="main-content" className="strategy-login">
      <div className="strategy-login-inner">
        <Image className="brand-mark strategy-login-logo" src="/images/grailhiiv-logo.svg" alt="" width={80} height={86} />
        <form action={login}>
          <label>Email<input name="email" type="email" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p role="alert">Unable to sign in. Check your email and password.</p>}
          <SignInButton />
        </form>
      </div>
    </main>
  );
}
