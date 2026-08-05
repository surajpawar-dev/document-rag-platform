# Document RAG Platform

Parent repository for the Document RAG microservice platform. The service folders are Git submodules, so each service keeps its own Git history and GitHub repository.

## Services

- `rag-upload-service` - file upload, metadata, and S3 integration entrypoint.
- `rag-document-processing-service` - document ingestion, parsing, extraction, and chunk preparation.
- `rag-embedding-service` - embedding generation, vector indexing, and semantic search.
- `rag-query-service` - user question handling, retrieval orchestration, and streaming LLM answers.

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

This compose file is for local development. It uses:

- LocalStack for S3 and SQS.
- PostgreSQL containers for document processing and embedding state.
- OpenSearch container for upload metadata and embedding vectors.
- Ollama container for local embedding generation.

Do not use the local compose file unchanged for production.

Default host ports:

- Upload service: `http://localhost:8080`
- Document processing service: `http://localhost:8081`
- Embedding service: `http://localhost:8082`
- Query service: `http://localhost:8083`
- OpenSearch: `http://localhost:9200`
- LocalStack: `http://localhost:4566`
- Ollama: `http://localhost:11434`

Query streaming endpoint:

```text
POST http://localhost:8083/api/v1/query/stream
Accept: text/event-stream
```

## Higher Environments

For dev, staging, or production deployments, run the services with:

```text
SPRING_PROFILES_ACTIVE=prod
```

Provide infrastructure values through environment variables, secrets, or your deployment platform:

- Real PostgreSQL databases for `rag-document-processing-service` and `rag-embedding-service`.
- Real S3 bucket for uploaded PDFs.
- Real SQS queues for `document-ready` and `embedding-created` events.
- Real OpenSearch endpoint for metadata and vector indexes.
- Real Ollama or embedding model endpoint reachable by `rag-embedding-service`.
- Real LLM endpoint reachable by `rag-query-service`.
- AWS credentials through IAM role, task role, instance profile, or the standard AWS SDK credential chain.

LocalStack endpoints such as `AWS_S3_ENDPOINT=http://localstack:4566` and `AWS_SQS_ENDPOINT=http://localstack:4566` are local-only. In production, leave AWS endpoint override variables empty or unset so the AWS SDK uses real AWS service endpoints automatically.

Each service README contains the detailed infrastructure checklist and required environment variables for that service.

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
- `rag-chat-service`
- `rag-api-gateway`
- `rag-observability-service`
