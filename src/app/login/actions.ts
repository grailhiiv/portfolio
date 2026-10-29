"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (email !== "admin@grailhiiv.com" || !password) redirect("/login?error=1");
  const client = await supabaseServer();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email_confirmed_at) {
    if (data.session) await client.auth.signOut();
    redirect("/login?error=1");
  }
  redirect("/strategy");
}
export async function logout() {
  const client = await supabaseServer();
  await client.auth.signOut();
  redirect("/login");
}
