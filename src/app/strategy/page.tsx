import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";
import { getOpenAIKeyStatus } from "./actions";
import type { CloudRecord } from "./cloud";
import StrategyWorkspace from "./workspace";
import "./strategy.css";

export const metadata: Metadata = { title: "Strategy Workspace", robots: { index: false, follow: false } };
export default async function StrategyPage() {
  const client = await supabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.email_confirmed_at) redirect("/login");
  const [{ data: rows, error: recordsError }, keyStatus] = await Promise.all([
    client.from("strategy_records").select("id, draft, updated_at").order("updated_at", { ascending: false }),
    getOpenAIKeyStatus(user.id),
  ]);
  const initialRecords: CloudRecord[] | null = recordsError
    ? null
    : (rows ?? []).map(row => ({ id: row.id, draft: row.draft, updatedAt: row.updated_at }));
  return (
    <StrategyWorkspace
      ownerId={user.id}
      openAIConfigured={keyStatus.configured}
      hasCustomOpenAIKey={keyStatus.hasCustomKey}
      initialRecords={initialRecords}
    />
  );
}
