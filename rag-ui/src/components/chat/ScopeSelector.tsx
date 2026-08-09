import { Bot, Files, FolderSearch, Library } from "lucide-react";
import type { CollectionRecord, DocumentRecord, SearchMode, SearchScope } from "../../lib/types";

const modes: Array<{ value: SearchMode; label: string; description: string; icon: typeof Bot }> = [
  { value: "GENERAL", label: "General AI", description: "Direct LLM call", icon: Bot },
  { value: "ALL_DOCUMENTS", label: "All Documents", description: "Search every indexed file", icon: Library },
  { value: "SPECIFIC", label: "Specific Documents", description: "Search selected PDFs", icon: Files },
  { value: "COLLECTION", label: "Collections", description: "Search one folder", icon: FolderSearch }
];

export function ScopeSelector({
  scope,
  documents,
  collections,
  onChange
}: {
  scope: SearchScope;
  documents: DocumentRecord[];
  collections: CollectionRecord[];
  onChange: (scope: SearchScope) => void;
}) {
  const toggleDocument = (documentId: string) => {
    const documentIds = scope.documentIds.includes(documentId)
      ? scope.documentIds.filter((id) => id !== documentId)
      : [...scope.documentIds, documentId];
    onChange({ ...scope, documentIds });
  };

  return (
    <section className="scope-panel glass-panel">
      <div className="scope-grid">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              className={`scope-option ${scope.mode === mode.value ? "active" : ""}`}
              key={mode.value}
              onClick={() => onChange({ ...scope, mode: mode.value })}
            >
              <Icon size={18} />
              <span>{mode.label}</span>
              <small>{mode.description}</small>
            </button>
          );
        })}
      </div>

      {scope.mode === "SPECIFIC" ? (
        <div className="picker-row">
          {documents.length ? (
            documents.map((document) => (
              <label className="check-pill" key={document.id}>
                <input type="checkbox" checked={scope.documentIds.includes(document.id)} onChange={() => toggleDocument(document.id)} />
                {document.fileName}
              </label>
            ))
          ) : (
            <p className="muted">Upload documents before using document-specific search.</p>
          )}
        </div>
      ) : null}

      {scope.mode === "COLLECTION" ? (
        <select value={scope.collectionId} onChange={(event) => onChange({ ...scope, collectionId: event.target.value })}>
          <option value="">Select a collection</option>
          {collections.map((collection) => (
            <option value={collection.id} key={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      ) : null}
    </section>
  );
}
