import type { ChatSession, CollectionRecord, DocumentRecord } from "./types";

const documentsKey = "rag-ui.documents";
const collectionsKey = "rag-ui.collections";
const sessionsKey = "rag-ui.sessions";

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const documentStore = {
  all: () => read<DocumentRecord[]>(documentsKey, []),
  save: (documents: DocumentRecord[]) => write(documentsKey, documents),
  upsert: (document: DocumentRecord) => {
    const documents = documentStore.all();
    const next = [document, ...documents.filter((item) => item.id !== document.id)];
    documentStore.save(next);
    return next;
  },
  remove: (id: string) => {
    const next = documentStore.all().filter((document) => document.id !== id);
    documentStore.save(next);
    return next;
  }
};

export const collectionStore = {
  all: () => read<CollectionRecord[]>(collectionsKey, []),
  save: (collections: CollectionRecord[]) => write(collectionsKey, collections)
};

export const chatStore = {
  all: () => read<ChatSession[]>(sessionsKey, []),
  save: (sessions: ChatSession[]) => write(sessionsKey, sessions)
};
