import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage as ChatMessageType } from "../../lib/types";
import { SourceCitations } from "./SourceCitations";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  return (
    <article className={`chat-message ${message.role}`}>
      <div className="message-avatar">{message.role === "user" ? <UserRound size={18} /> : <Bot size={18} />}</div>
      <div className="message-body">
        <div className="message-meta">{message.role === "user" ? "You" : "Assistant"}</div>
        {message.error ? <div className="error-box">{message.error}</div> : null}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || (message.isStreaming ? "Thinking..." : "")}</ReactMarkdown>
        {message.isStreaming ? <span className="streaming-cursor" /> : null}
        {message.sources?.length ? <SourceCitations sources={message.sources} /> : null}
      </div>
    </article>
  );
}
