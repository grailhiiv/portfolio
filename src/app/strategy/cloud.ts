"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

const client = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const bucket = client.storage.from("strategy-screenshots");
export type CloudRecord = { id: string; updatedAt: string; draft: unknown };
export async function listRecords(): Promise<CloudRecord[]> {
  const { data, error } = await client.from("strategy_records").select("id, draft, updated_at").order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, draft: row.draft, updatedAt: row.updated_at }));
}
export async function saveRecord(owner: string, record: CloudRecord, insertOnly = false) {
  const row = { id: record.id, owner_id: owner, draft: record.draft, updated_at: record.updatedAt };
  const result = insertOnly ? await client.from("strategy_records").upsert(row, { onConflict: "id", ignoreDuplicates: true }) : await client.from("strategy_records").upsert(row, { onConflict: "id" });
  if (result.error) throw result.error;
}
export async function removeRecords(ids: string[]) {
  if (!ids.length) return;
  const { error } = await client.from("strategy_records").delete().in("id", ids);
  if (error) throw error;
}
export type CloudAttachment = { id: string; name: string; path: string };
function encodeName(value: string) { return btoa(Array.from(new TextEncoder().encode(value), byte => String.fromCharCode(byte)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function decodeName(value: string) { try { return new TextDecoder().decode(Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0))); } catch { return "Screenshot"; } }
export async function listAttachments(owner: string, profileId: string): Promise<CloudAttachment[]> {
  const folder = `${owner}/${profileId}`; const files: CloudAttachment[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await bucket.list(folder, { limit: 100, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw error;
    for (const item of data ?? []) { const split = item.name.indexOf("--"); if (item.id && split > 0) files.push({ id: item.name.slice(0, split), name: decodeName(item.name.slice(split + 2)), path: `${folder}/${item.name}` }); }
    if (!data || data.length < 100) break;
  }
  return files;
}
export async function uploadAttachment(owner: string, profileId: string, id: string, file: File) {
  const path = `${owner}/${profileId}/${id}--${encodeName(file.name)}`;
  const { error } = await bucket.upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
}
export async function deleteAttachmentPaths(paths: string[]) {
  for (let i = 0; i < paths.length; i += 100) { const { error } = await bucket.remove(paths.slice(i, i + 100)); if (error) throw error; }
}
export async function deleteProfileCloud(owner: string, profileId: string) { const files = await listAttachments(owner, profileId); await deleteAttachmentPaths(files.map(file => file.path)); }
export async function downloadAttachment(file: CloudAttachment) {
  const { data, error } = await bucket.download(file.path); if (error) throw error;
  const url = URL.createObjectURL(data); const link = document.createElement("a"); link.href = url; link.download = file.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
