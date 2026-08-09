import { apiConfig } from "./config";
import { requestJson } from "./http";
import type { FileMetadataResponse, InitiateUploadResponse } from "./types";

export async function initiateUpload(file: File, title: string, uploadedBy: string) {
  return requestJson<InitiateUploadResponse>(`${apiConfig.uploadBase}/api/uploads/initiate`, {
    method: "POST",
    body: JSON.stringify({
      bookId: "default",
      title,
      fileName: file.name,
      contentType: file.type || "application/pdf",
      size: file.size,
      uploadedBy,
      idempotencyKey: `${file.name}-${file.size}-${Date.now()}`
    })
  });
}

export async function uploadContent(fileId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiConfig.uploadBase}/api/uploads/${fileId}/content`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return response.json() as Promise<FileMetadataResponse>;
}

export function completeUpload(fileId: string) {
  return requestJson<FileMetadataResponse>(`${apiConfig.uploadBase}/api/uploads/${fileId}/complete`, {
    method: "POST"
  });
}

export function getUploadMetadata(fileId: string) {
  return requestJson<FileMetadataResponse>(`${apiConfig.uploadBase}/api/uploads/${fileId}`);
}
