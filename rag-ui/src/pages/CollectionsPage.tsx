import { FolderPlus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { createId } from "../lib/http";
import { collectionStore, documentStore } from "../lib/storage";
import type { CollectionRecord } from "../lib/types";

export function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionRecord[]>(() => collectionStore.all());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const documents = documentStore.all();

  const saveCollections = (next: CollectionRecord[]) => {
    setCollections(next);
    collectionStore.save(next);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const collection: CollectionRecord = {
      id: createId("collection"),
      name: name.trim(),
      description: description.trim(),
      documentIds: selectedDocs,
      createdAt: new Date().toISOString()
    };
    saveCollections([collection, ...collections]);
    setName("");
    setDescription("");
    setSelectedDocs([]);
  };

  const toggleDocument = (id: string) => {
    setSelectedDocs((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="page-stack">
      <PageHeader title="Collections" description="Create focused search groups for collection-scoped chat." />

      <form className="collection-builder glass-panel" onSubmit={submit}>
        <div className="form-grid">
          <input value={name} placeholder="Collection name" onChange={(event) => setName(event.target.value)} />
          <input value={description} placeholder="Description" onChange={(event) => setDescription(event.target.value)} />
          <button>
            <FolderPlus size={17} />
            Create
          </button>
        </div>
        <div className="picker-row">
          {documents.length ? (
            documents.map((document) => (
              <label className="check-pill" key={document.id}>
                <input type="checkbox" checked={selectedDocs.includes(document.id)} onChange={() => toggleDocument(document.id)} />
                {document.fileName}
              </label>
            ))
          ) : (
            <p className="muted">Upload documents before creating a collection.</p>
          )}
        </div>
      </form>

      <section className="collection-grid">
        {collections.length ? (
          collections.map((collection) => (
            <article className="collection-card glass-panel" key={collection.id}>
              <div>
                <h2>{collection.name}</h2>
                <p>{collection.description || "No description"}</p>
              </div>
              <span>{collection.documentIds.length} documents</span>
              <button onClick={() => saveCollections(collections.filter((item) => item.id !== collection.id))}>
                <Trash2 size={16} />
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state glass-panel">No collections yet.</div>
        )}
      </section>
    </div>
  );
}
