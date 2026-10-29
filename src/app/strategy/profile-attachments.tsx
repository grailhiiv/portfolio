"use client";

export type Attachment = { id: string; file: File };
const dbName = "grailhiiv-strategy-attachments";
const storeName = "profiles";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Storage is unavailable."));
  });
}

export async function readAttachments(profileId: string): Promise<Attachment[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(profileId);
    transaction.oncomplete = () => { db.close(); resolve(Array.isArray(request.result) ? request.result : []); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

export async function deleteAttachments(profileIds: string[] | null): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    if (profileIds === null) store.clear();
    else profileIds.forEach(id => store.delete(id));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
