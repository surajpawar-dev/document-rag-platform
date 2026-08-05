# Document RAG Platform

Parent repository for the Document RAG microservice platform. The service folders are Git submodules, so each service keeps its own Git history and GitHub repository.

## Services

- `rag-upload-service` - file upload, metadata, and S3 integration entrypoint.
- `rag-document-processing-service` - document ingestion, parsing, extraction, and chunk preparation.
- `rag-embedding-service` - embedding generation, vector indexing, and semantic search.

## Clone

Clone the parent and all services in one command:

```powershell
git clone --recurse-submodules https://github.com/surajpawar-dev/document-rag-platform.git
```

If the parent was cloned without submodules:

```powershell
git submodule update --init --recursive
```

## Run

From this folder:

```powershell
docker compose up --build
```

Default host ports:

- Upload service: `http://localhost:8080`
- Document processing service: `http://localhost:8081`
- Embedding service: `http://localhost:8082`
- OpenSearch: `http://localhost:9200`
- LocalStack: `http://localhost:4566`
- Ollama: `http://localhost:11434`

## Working On A Service

Each service is worked on independently inside its own folder:

```powershell
cd rag-upload-service
git status
git add .
git commit -m "Your service change"
git push origin main
```

After a service commit is pushed, update the parent repo pointer:

```powershell
cd ..
git add rag-upload-service
git commit -m "Update upload service submodule"
git push origin main
```

## Naming Convention

Use `rag-<capability>-service` for backend services added to this platform.

Examples:

- `rag-auth-service`
- `rag-query-service`
- `rag-api-gateway`
- `rag-observability-service`
