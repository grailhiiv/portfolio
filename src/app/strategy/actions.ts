"use server";

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";

const COOKIE_NAME = "grailhiiv_openai_key";
const MODEL_COOKIE = "grailhiiv_openai_model";
const EFFORT_COOKIE = "grailhiiv_openai_effort";

export type OpenAIModel = "gpt-6.1-terra";
export type ReasoningEffort = "low" | "medium" | "high" | "xhigh" | "max";

const VALID_MODELS = new Set<OpenAIModel>(["gpt-6.1-terra"]);
const VALID_EFFORTS = new Set<ReasoningEffort>(["low", "medium", "high", "xhigh", "max"]);

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

function maskKey(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const prefixMatch = /^(sk-[a-z0-9]+-|sk-)/i.exec(trimmed);
  const prefix = prefixMatch ? prefixMatch[1] : `${trimmed.slice(0, 4)}-`;
  return `${prefix}************`;
}

export async function requireAdminUserId(): Promise<string> {
  const client = await supabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.email_confirmed_at) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

export async function resolveActiveKey(userId: string): Promise<{ customKey: string | null; envKey: string | null; activeKey: string | null }> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const customKey = token ? decryptKey(token, userId)?.trim() || null : null;
  const envKey = process.env.OPENAI_API_KEY?.trim() || null;
  return { customKey, envKey, activeKey: customKey || envKey };
}

export async function getOpenAIKeyStatus(userId: string): Promise<{
  configured: boolean;
  hasCustomKey: boolean;
  maskedKey: string | null;
  model: OpenAIModel;
  reasoningEffort: ReasoningEffort;
}> {
  const store = await cookies();
  const { customKey, activeKey } = await resolveActiveKey(userId);
  const rawModel = store.get(MODEL_COOKIE)?.value as OpenAIModel | undefined;
  const rawEffort = store.get(EFFORT_COOKIE)?.value as ReasoningEffort | undefined;
  return {
    configured: Boolean(activeKey),
    hasCustomKey: Boolean(customKey),
    maskedKey: maskKey(activeKey),
    model: rawModel && VALID_MODELS.has(rawModel) ? rawModel : "gpt-6.1-terra",
    reasoningEffort: rawEffort && VALID_EFFORTS.has(rawEffort) ? rawEffort : "medium",
  };
}

export async function saveOpenAIKey(rawKey: string): Promise<{ ok: boolean; configured: boolean; hasCustomKey: boolean; maskedKey: string | null; message: string }> {
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
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return {
    ok: true,
    configured: true,
    hasCustomKey: true,
    maskedKey: maskKey(trimmed),
    message: "API key saved. For security, the full key is never displayed.",
  };
}

export async function removeOpenAIKey(): Promise<{ ok: boolean; configured: boolean; hasCustomKey: boolean; maskedKey: string | null; message: string }> {
  await requireAdminUserId();
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/" });
  store.delete({ name: COOKIE_NAME, path: "/strategy" });
  const envKey = process.env.OPENAI_API_KEY?.trim() || null;
  const hasEnvKey = Boolean(envKey);
  return {
    ok: true,
    configured: hasEnvKey,
    hasCustomKey: false,
    maskedKey: maskKey(envKey),
    message: hasEnvKey ? "Saved API key removed. Using server environment key." : "Saved API key removed.",
  };
}

export async function saveOpenAIPreferences(model: string, reasoningEffort: string): Promise<{ model: OpenAIModel; reasoningEffort: ReasoningEffort }> {
  await requireAdminUserId();
  const nextModel: OpenAIModel = VALID_MODELS.has(model as OpenAIModel) ? (model as OpenAIModel) : "gpt-6.1-terra";
  const nextEffort: ReasoningEffort = VALID_EFFORTS.has(reasoningEffort as ReasoningEffort) ? (reasoningEffort as ReasoningEffort) : "medium";
  const store = await cookies();
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
  store.set(MODEL_COOKIE, nextModel, cookieOpts);
  store.set(EFFORT_COOKIE, nextEffort, cookieOpts);
  return { model: nextModel, reasoningEffort: nextEffort };
}
