export type SearchMode = "GENERAL" | "ALL_DOCUMENTS" | "SPECIFIC" | "COLLECTION";

export type ProcessingStatus = "RECEIVED" | "READING" | "CLEANING" | "CHUNKING" | "STORING" | "READY" | "FAILED" | "PROCESSING" | "INDEXED";

export interface SearchScope {
  mode: SearchMode;
  documentIds: string[];
  collectionId: string;
}

export interface ChatRequestPayload extends SearchScope {
  question: string;
}

export interface BackendQueryRequest {
  question: string;
  mode?: SearchMode;
  topK?: number;
  documentIds?: string[];
  includeSources?: boolean;
}

export interface SourceChunk {
  documentId: string;
  chunkId: string;
  chunkOrder: number;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface QueryStreamEvent {
  type: "token" | "sources" | "done" | string;
  content?: string | null;
  sources?: SourceChunk[] | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isStreaming?: boolean;
  sources?: SourceChunk[];
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface DocumentRecord {
  id: string;
  fileId?: string;
  fileName: string;
  title?: string;
  uploadDate: string;
  processingStatus: ProcessingStatus | string;
  size?: number;
  contentType?: string;
  checksum?: string;
  s3Bucket?: string;
  s3Key?: string;
  language?: string;
  chunkCount?: number;
  failureReason?: string;
}

export interface CollectionRecord {
  id: string;
  name: string;
  description?: string;
  documentIds: string[];
  createdAt: string;
}

export interface FileMetadataResponse {
  fileId: string;
  fileName: string;
  bookId: string;
  title: string;
  s3Key: string;
  checksum?: string;
  contentType: string;
  size: number;
  status: string;
  strategy: "BACKEND" | "DIRECT_S3" | "MULTIPART" | string;
  uploadedBy: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateUploadResponse {
  fileId: string;
  bookId: string;
  title: string;
  s3Key: string;
  checksum?: string;
  status: string;
  strategy: "BACKEND" | "DIRECT_S3" | "MULTIPART" | string;
  uploadUrl?: string;
  uploadId?: string;
  partUploadUrls?: Array<{ partNumber: number; uploadUrl: string }>;
}

export interface DocumentResponse {
  id: string;
  fileName: string;
  contentType: string;
  source: string;
  sourceBucket?: string;
  sourceKey?: string;
  checksum: string;
  processingStatus: string;
  language?: string;
  pageCount?: number;
  chunkCount?: number;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DocumentStatusResponse {
  documentId: string;
  status: string;
  failureReason?: string;
  updatedAt: string;
}
