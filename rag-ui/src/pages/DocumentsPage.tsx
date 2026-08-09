import { Eye, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { DocumentUpload } from "../components/documents/DocumentUpload";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getDocument, getDocumentChunks, reprocessDocument } from "../lib/documentsApi";
import { documentStore } from "../lib/storage";
import { initiateUpload, uploadContent } from "../lib/uploadApi";
import type { DocumentRecord } from "../lib/types";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => documentStore.all());
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [chunks, setChunks] = useState<unknown>(null);
  const [error, setError] = useState("");
  const indexedCount = useMemo(() => documents.filter((document) => ["READY", "INDEXED"].includes(document.processingStatus)).length, [documents]);

  const refresh = (next: DocumentRecord[]) => {
    setDocuments(next);
    documentStore.save(next);
  };

  const upload = async (file: File, title: string) => {
    setError("");
    try {
      const initiated = await initiateUpload(file, title, "ui-user");
      const metadata = await uploadContent(initiated.fileId, file);
      const document: DocumentRecord = {
        id: metadata.fileId,
        fileId: metadata.fileId,
        fileName: metadata.fileName,
        title: metadata.title,
        uploadDate: metadata.createdAt,
        processingStatus: metadata.status,
        size: metadata.size,
        contentType: metadata.contentType,
        checksum: metadata.checksum,
        s3Key: metadata.s3Key
      };
      refresh([document, ...documents.filter((item) => item.id !== document.id)]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const viewDocument = async (document: DocumentRecord) => {
    setError("");
    setSelected(document);
    setChunks(null);
    try {
      const detail = await getDocument(document.id);
      const nextDocument: DocumentRecord = {
        ...document,
        fileName: detail.fileName,
        processingStatus: detail.processingStatus,
        chunkCount: detail.chunkCount,
        failureReason: detail.failureReason,
        language: detail.language
      };
      setSelected(nextDocument);
      refresh(documents.map((item) => (item.id === document.id ? nextDocument : item)));
      setChunks(await getDocumentChunks(document.id, 0, 10));
    } catch (viewError) {
      setError(viewError instanceof Error ? viewError.message : "Could not load document details.");
    }
  };

  const reindex = async (document: DocumentRecord) => {
    setError("");
    try {
      const detail = await reprocessDocument(document.id);
      refresh(documents.map((item) => (item.id === document.id ? { ...item, processingStatus: detail.processingStatus } : item)));
    } catch (reindexError) {
      setError(reindexError instanceof Error ? reindexError.message : "Re-index failed.");
    }
  };

  const remove = (document: DocumentRecord) => {
    const next = documents.filter((item) => item.id !== document.id);
    refresh(next);
    if (selected?.id === document.id) setSelected(null);
  };

  return (
    <div className="page-stack">
      <PageHeader title="Documents" description={`${documents.length} uploaded, ${indexedCount} indexed`} />
      {error ? <div className="error-box">{error}</div> : null}
      <DocumentUpload onUpload={upload} />

      <section className="table-panel glass-panel">
        <table>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th>Chunks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length ? (
              documents.map((document) => (
                <tr key={document.id}>
                  <td>
                    <strong>{document.title || document.fileName}</strong>
                    <span>{document.fileName}</span>
                  </td>
                  <td>{new Date(document.uploadDate).toLocaleString()}</td>
                  <td><StatusBadge status={document.processingStatus} /></td>
                  <td>{document.chunkCount ?? "-"}</td>
                  <td className="icon-actions">
                    <button title="View" onClick={() => void viewDocument(document)}><Eye size={16} /></button>
                    <button title="Re-index" onClick={() => void reindex(document)}><RefreshCw size={16} /></button>
                    <button title="Delete locally" onClick={() => remove(document)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-cell">Upload a PDF to populate document management.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {selected ? (
        <section className="detail-panel glass-panel">
          <h2>{selected.title || selected.fileName}</h2>
          <p>{selected.failureReason || "Document details and first chunks will appear here when available from the processing service."}</p>
          <pre>{chunks ? JSON.stringify(chunks, null, 2) : "No chunks loaded."}</pre>
        </section>
      ) : null}
    </div>
  );
}
