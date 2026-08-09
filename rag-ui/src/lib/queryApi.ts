import { apiConfig } from "./config";
import type { BackendQueryRequest, ChatRequestPayload, QueryStreamEvent } from "./types";

function toBackendQueryRequest(payload: ChatRequestPayload): BackendQueryRequest {
  return {
    question: payload.question,
    includeSources: payload.mode !== "GENERAL",
    topK: payload.mode === "GENERAL" ? 1 : 8,
    documentIds: payload.mode === "SPECIFIC" ? payload.documentIds : []
  };
}

export async function streamQuery(
  payload: ChatRequestPayload,
  onEvent: (event: QueryStreamEvent) => void,
  signal?: AbortSignal
) {
  const response = await fetch(`${apiConfig.queryBase}/api/v1/query/stream`, {
    method: "POST",
    signal,
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toBackendQueryRequest(payload))
  });

  if (!response.ok || !response.body) {
    throw new Error(`Unable to start chat stream. Status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split(/\n\n/);
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const dataLines = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (!dataLines.length) continue;
      const data = dataLines.join("\n");
      if (data === "[DONE]") {
        onEvent({ type: "done" });
        continue;
      }

      onEvent(JSON.parse(data) as QueryStreamEvent);
    }
  }
}
