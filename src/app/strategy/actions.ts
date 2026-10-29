"use server";

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";

const COOKIE_NAME = "grailhiiv_openai_key";

function deriveKey(userId: string): Buffer {
  const secret = process.env.OPENAI_KEY_SECRET || SUPABASE_PUBLISHABLE_KEY;
  return scryptSync(secret, `grailhiiv-openai:${userId}`, 32);
}

function encryptKey(plainText: string, userId: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(userId), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decryptKey(token: string, userId: string): string | null {
  try {
    const [ivPart, tagPart, dataPart] = token.split(".");
    if (!ivPart || !tagPart || !dataPart) return null;
    const decipher = createDecipheriv("aes-256-gcm", deriveKey(userId), Buffer.from(ivPart, "base64url"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(dataPart, "base64url")), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

async function requireAdminUserId(): Promise<string> {
  const client = await supabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.email_confirmed_at) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

export async function getOpenAIKeyStatus(userId: string): Promise<{ configured: boolean; hasCustomKey: boolean }> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const customKey = token ? decryptKey(token, userId) : null;
  const hasCustomKey = Boolean(customKey?.trim());
  const hasEnvKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  return { configured: hasCustomKey || hasEnvKey, hasCustomKey };
}

export async function saveOpenAIKey(rawKey: string): Promise<{ ok: boolean; configured: boolean; hasCustomKey: boolean; message: string }> {
  const userId = await requireAdminUserId();
  const trimmed = rawKey.trim();
  if (!trimmed || trimmed.length < 16 || /\s/.test(trimmed)) {
    const status = await getOpenAIKeyStatus(userId);
    return { ok: false, ...status, message: "Enter a valid OpenAI API key." };
  }
  const store = await cookies();
  store.set(COOKIE_NAME, encryptKey(trimmed, userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/strategy",
    maxAge: 60 * 60 * 24 * 365,
  });
  return { ok: true, configured: true, hasCustomKey: true, message: "API key saved. For security, the key is never displayed." };
}

export async function removeOpenAIKey(): Promise<{ ok: boolean; configured: boolean; hasCustomKey: boolean; message: string }> {
  await requireAdminUserId();
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/strategy" });
  const hasEnvKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  return {
    ok: true,
    configured: hasEnvKey,
    hasCustomKey: false,
    message: hasEnvKey ? "Saved API key removed. Using server environment key." : "Saved API key removed.",
  };
}
