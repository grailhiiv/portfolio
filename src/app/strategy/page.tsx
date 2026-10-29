import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import StrategyWorkspace from "./workspace";
import "./strategy.css";

export const metadata: Metadata = { title: "Strategy Workspace", robots: { index: false, follow: false } };
export default async function StrategyPage() {
  const client = await supabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== "admin@grailhiiv.com" || !user.email_confirmed_at) redirect("/login");
  return <StrategyWorkspace ownerId={user.id} openAIConfigured={Boolean(process.env.OPENAI_API_KEY?.trim())} />;
}
