export const apiConfig = {
  queryBase: import.meta.env.VITE_QUERY_API_BASE ?? "/query-api",
  uploadBase: import.meta.env.VITE_UPLOAD_API_BASE ?? "/upload-api",
  documentsBase: import.meta.env.VITE_DOCUMENTS_API_BASE ?? "/documents-api",
  embeddingBase: import.meta.env.VITE_EMBEDDING_API_BASE ?? "/embedding-api"
};
