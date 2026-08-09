import { apiConfig } from "./config";
import { requestJson } from "./http";
import type { DocumentResponse, DocumentStatusResponse } from "./types";

export function processDocument(input: {
  fileName: string;
  s3Bucket: string;
  s3Key: string;
  checksum: string;
  language?: string;
}) {
  return requestJson<DocumentResponse>(`${apiConfig.documentsBase}/documents/process`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getDocument(documentId: string) {
  return requestJson<DocumentResponse>(`${apiConfig.documentsBase}/documents/${documentId}`);
}

export function getDocumentStatus(documentId: string) {
  return requestJson<DocumentStatusResponse>(`${apiConfig.documentsBase}/documents/${documentId}/status`);
}

export function reprocessDocument(documentId: string) {
  return requestJson<DocumentResponse>(`${apiConfig.documentsBase}/documents/${documentId}/reprocess`, {
    method: "POST"
  });
}

export function getDocumentChunks(documentId: string, page = 0, size = 50) {
  return requestJson(`${apiConfig.documentsBase}/documents/${documentId}/chunks?page=${page}&size=${size}`);
}
