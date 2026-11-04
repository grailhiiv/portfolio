"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  listRecords,
  saveRecord,
  uploadAttachment,
  listAttachments,
  type CloudRecord,
} from "./cloud";
import { deleteAttachments, readAttachments } from "./profile-attachments";
import {
  normalizeDraft,
  type Draft,
  type Profile,
  type Finding,
} from "./schema";

const legacyKey = "grailhiiv-strategy-draft-v1";
const key = "grailhiiv-strategy-records-v2";
export type RecordEntry = { id: string; updatedAt: string; draft: Draft };
export type WorkspaceData = {
  version: 2;
  activeId: string | null;
  records: RecordEntry[];
};

export function useStrategyStorage(
  ownerId: string,
  initialRecords: CloudRecord[] | null,
  setDraft: Dispatch<SetStateAction<Draft>>,
  setStatus: Dispatch<SetStateAction<string>>,
) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<WorkspaceData>({
    version: 2,
    activeId: null,
    records: [],
  });
  const dataRef = useRef(data);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const pendingRecordsRef = useRef<Map<string, RecordEntry>>(new Map());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyKey = `grailhiiv-unsynced-${ownerId}`;

  function flushSaves(): Promise<void> {
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const batch = Array.from(pendingRecordsRef.current.values());
    pendingRecordsRef.current.clear();
    if (!batch.length) return saveQueue.current;
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(async () => {
        let failed = false;
        for (const record of batch) {
          try {
            await saveRecord(ownerId, record);
            const pending = JSON.parse(
              localStorage.getItem(dirtyKey) || "{}",
            ) as Record<string, string>;
            if (pending[record.id] === record.updatedAt) {
              delete pending[record.id];
              localStorage.setItem(dirtyKey, JSON.stringify(pending));
            }
          } catch {
            failed = true;
          }
        }
        if (failed) {
          setStatus(
            "Could not save to Supabase. Your browser backup remains available; retry by editing the record again.",
          );
        } else {
          const pending = JSON.parse(
            localStorage.getItem(dirtyKey) || "{}",
          ) as Record<string, string>;
          if (!Object.keys(pending).length) setStatus("");
        }
      });
    return saveQueue.current;
  }

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flushSaves();
    };
    const onPageHide = () => {
      void flushSaves();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      void flushSaves();
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const marker = `grailhiiv-supabase-migrated-${ownerId}`;
        let records = initialRecords ?? (await listRecords());
        let saved = localStorage.getItem(key);
        const legacy = localStorage.getItem(legacyKey);
        if (!saved && legacy && !localStorage.getItem(marker)) {
          const values = JSON.parse(legacy) as Record<string, unknown>;
          if (!values || typeof values !== "object" || Array.isArray(values))
            throw new Error("Invalid legacy draft");
          const profiles = Array.isArray(values.profiles)
            ? (values.profiles as Profile[])
            : [];
          const findings = Array.isArray(values.findings)
            ? (values.findings as Finding[])
            : values.source || values.research
              ? [
                  {
                    id: crypto.randomUUID(),
                    source:
                      typeof values.source === "string" ? values.source : "",
                    date: "",
                    observation:
                      typeof values.research === "string"
                        ? values.research
                        : "",
                    status: "",
                    category: "",
                  },
                ]
              : [];
          const id = crypto.randomUUID();
          const migratedDraft = normalizeDraft({
            ...(values as Partial<Draft>),
            profiles,
            findings,
          });
          saved = JSON.stringify({
            version: 2,
            activeId: id,
            records: [
              { id, updatedAt: new Date().toISOString(), draft: migratedDraft },
            ],
          });
          localStorage.setItem(key, saved);
        }
        const rawDirty = localStorage.getItem(dirtyKey);
        if (saved && rawDirty && rawDirty !== "{}") {
          const backup = JSON.parse(saved) as WorkspaceData;
          const dirtyMap = JSON.parse(rawDirty) as Record<string, string>;
          const remoteTyped = records.map((record) => ({
            ...record,
            draft: normalizeDraft(record.draft as Partial<Draft>),
          }));
          const mergedMap = new Map<string, RecordEntry>(
            remoteTyped.map((record) => [record.id, record]),
          );
          for (const localRecord of backup.records ?? []) {
            const normalized: RecordEntry = {
              ...localRecord,
              draft: normalizeDraft(localRecord.draft),
            };
            const remoteRecord = mergedMap.get(localRecord.id);
            if (
              !remoteRecord ||
              dirtyMap[localRecord.id] ||
              localRecord.updatedAt >= remoteRecord.updatedAt
            ) {
              mergedMap.set(localRecord.id, normalized);
            }
          }
          const mergedRecords = Array.from(mergedMap.values()).sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt),
          );
          let syncFailed = false;
          for (const id of Object.keys(dirtyMap)) {
            const record = mergedMap.get(id);
            if (!record) {
              delete dirtyMap[id];
              continue;
            }
            try {
              await saveRecord(ownerId, record);
              delete dirtyMap[id];
            } catch {
              syncFailed = true;
            }
          }
          localStorage.setItem(dirtyKey, JSON.stringify(dirtyMap));
          if (!active) return;
          const activeId =
            backup.activeId && mergedMap.has(backup.activeId)
              ? backup.activeId
              : (mergedRecords[0]?.id ?? null);
          const reconciled: WorkspaceData = {
            version: 2,
            activeId,
            records: mergedRecords,
          };
          localStorage.setItem(key, JSON.stringify(reconciled));
          dataRef.current = reconciled;
          setData(reconciled);
          setDraft(
            reconciled.records.find((item) => item.id === activeId)?.draft ??
              normalizeDraft(null),
          );
          if (syncFailed) {
            setStatus(
              "Unsynced changes were recovered from this browser. Export your draft and retry saving before using another device.",
            );
          }
          setReady(true);
          return;
        }
        if (saved && !localStorage.getItem(marker)) {
          const local = JSON.parse(saved) as WorkspaceData;
          if (local.version !== 2 || !Array.isArray(local.records))
            throw new Error("Invalid local data");
          const existing = new Set(records.map((record) => record.id));
          for (const record of local.records) {
            if (!existing.has(record.id))
              await saveRecord(
                ownerId,
                { ...record, draft: normalizeDraft(record.draft) },
                true,
              );
            for (const profile of record.draft.profiles ?? []) {
              const images = await readAttachments(profile.id);
              await Promise.all(
                images.map((image) =>
                  uploadAttachment(ownerId, profile.id, image.id, image.file),
                ),
              );
              const uploaded = await listAttachments(ownerId, profile.id);
              if (
                images.some(
                  (image) => !uploaded.some((item) => item.id === image.id),
                )
              )
                throw new Error("Screenshot verification failed");
            }
          }
          records = await listRecords();
          if (
            local.records.some(
              (record) => !records.some((item) => item.id === record.id),
            )
          )
            throw new Error("Record verification failed");
          localStorage.setItem(marker, "1");
          localStorage.removeItem(legacyKey);
          await deleteAttachments(null).catch(() => {});
        }
        if (!active) return;
        const typed = records.map((record) => ({
          ...record,
          draft: normalizeDraft(record.draft as Partial<Draft>),
        }));
        const activeId = typed[0]?.id ?? null;
        const next: WorkspaceData = { version: 2, activeId, records: typed };
        dataRef.current = next;
        setData(next);
        setDraft(typed[0]?.draft ?? normalizeDraft(null));
        setReady(true);
      } catch {
        if (active)
          setStatus(
            "Could not load or migrate data to Supabase. Your browser copy is unchanged. Refresh to retry.",
          );
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [ownerId, dirtyKey, initialRecords]);

  function persist(next: WorkspaceData): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(next));
      dataRef.current = next;
      setData(next);
      return true;
    } catch {
      setStatus(
        "Could not save the browser backup. Check your browser storage.",
      );
      return false;
    }
  }
  function queueSave(record: RecordEntry, immediate = false) {
    try {
      const pending = JSON.parse(
        localStorage.getItem(dirtyKey) || "{}",
      ) as Record<string, string>;
      pending[record.id] = record.updatedAt;
      localStorage.setItem(dirtyKey, JSON.stringify(pending));
    } catch {
      setStatus("Could not mark the browser backup as unsynced.");
    }
    pendingRecordsRef.current.set(record.id, record);
    if (immediate) {
      void flushSaves();
      return;
    }
    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void flushSaves();
    }, 400);
  }
  return {
    ready,
    data,
    dataRef,
    pendingRecordsRef,
    flushSaves,
    persist,
    queueSave,
  };
}
