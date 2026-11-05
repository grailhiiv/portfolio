import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";
import InvoiceWorkspace from "./workspace";
import "../workspace.css";
import "./invoice.css";

export const metadata: Metadata = { title: "Invoice Workspace", robots: { index: false, follow: false } };
export default async function InvoicePage() {
  const client = await supabaseServer();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.email_confirmed_at) redirect("/login");
  return <InvoiceWorkspace ownerId={user.id} />;
}
