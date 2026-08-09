import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatMessage } from "../components/chat/ChatMessage";
import { FollowUpSuggestions } from "../components/chat/FollowUpSuggestions";
import { ScopeSelector } from "../components/chat/ScopeSelector";
import { WelcomeScreen } from "../components/chat/WelcomeScreen";
import { PageHeader } from "../components/ui/PageHeader";
import { createId } from "../lib/http";
import { chatStore, collectionStore, documentStore } from "../lib/storage";
import { streamQuery } from "../lib/queryApi";
import type { ChatMessage as ChatMessageType, ChatSession, SearchScope } from "../lib/types";

function createSession(): ChatSession {
  const now = new Date().toISOString();
  return { id: createId("chat"), title: "New conversation", createdAt: now, updatedAt: now, messages: [] };
}

export function ChatPage() {
  const [params, setParams] = useSearchParams();
  const sessions = chatStore.all();
  const sessionId = params.get("session");
  const initialSession = sessions.find((session) => session.id === sessionId) ?? createSession();
  const [session, setSession] = useState<ChatSession>(initialSession);
  const [scope, setScope] = useState<SearchScope>({ mode: "GENERAL", documentIds: [], collectionId: "" });
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const documents = useMemo(() => documentStore.all(), []);
  const collections = useMemo(() => collectionStore.all(), []);

  const persist = (next: ChatSession) => {
    setSession(next);
    const existing = chatStore.all();
    chatStore.save([next, ...existing.filter((item) => item.id !== next.id)]);
    setParams({ session: next.id }, { replace: true });
  };

  const validateScope = () => {
    if (scope.mode === "SPECIFIC" && !scope.documentIds.length) return "Select at least one document before asking.";
    if (scope.mode === "COLLECTION" && !scope.collectionId) return "Select a collection before asking.";
    return "";
  };

  const sendQuestion = async (question: string) => {
    const validation = validateScope();
    if (validation) {
      const errorMessage: ChatMessageType = {
        id: createId("msg"),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        error: validation
      };
      persist({ ...session, messages: [...session.messages, errorMessage] });
      return;
    }

    const now = new Date().toISOString();
    const userMessage: ChatMessageType = { id: createId("msg"), role: "user", content: question, createdAt: now };
    const assistantId = createId("msg");
    const assistantMessage: ChatMessageType = { id: assistantId, role: "assistant", content: "", createdAt: now, isStreaming: true, sources: [] };
    let nextSession: ChatSession = {
      ...session,
      title: session.messages.length ? session.title : question.slice(0, 64),
      updatedAt: now,
      messages: [...session.messages, userMessage, assistantMessage]
    };
    persist(nextSession);

    setIsStreaming(true);
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      await streamQuery(
        {
          question,
          mode: scope.mode,
          documentIds: scope.mode === "COLLECTION" ? collections.find((item) => item.id === scope.collectionId)?.documentIds ?? [] : scope.documentIds,
          collectionId: scope.collectionId
        },
        (event) => {
          nextSession = {
            ...nextSession,
            updatedAt: new Date().toISOString(),
            messages: nextSession.messages.map((message) => {
              if (message.id !== assistantId) return message;
              if (event.type === "token") return { ...message, content: message.content + (event.content ?? "") };
              if (event.type === "sources") return { ...message, sources: event.sources ?? [] };
              if (event.type === "done") return { ...message, isStreaming: false };
              return message;
            })
          };
          persist(nextSession);
        },
        abortController.signal
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "The query stream failed.";
      nextSession = {
        ...nextSession,
        messages: nextSession.messages.map((item) => (item.id === assistantId ? { ...item, isStreaming: false, error: message } : item))
      };
      persist(nextSession);
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  return (
    <div className="chat-page">
      <PageHeader title="Chat" description="Grounded answers with streaming responses and source citations." />
      <ScopeSelector scope={scope} documents={documents} collections={collections} onChange={setScope} />

      <section className="chat-thread">
        {session.messages.length ? (
          session.messages.map((message) => <ChatMessage key={message.id} message={message} />)
        ) : (
          <WelcomeScreen onPrompt={sendQuestion} />
        )}
      </section>

      {session.messages.some((message) => message.role === "assistant" && message.content && !message.isStreaming) ? <FollowUpSuggestions onSelect={sendQuestion} /> : null}
      <ChatComposer isStreaming={isStreaming} onSubmit={sendQuestion} onStop={stopStreaming} />
    </div>
  );
}
