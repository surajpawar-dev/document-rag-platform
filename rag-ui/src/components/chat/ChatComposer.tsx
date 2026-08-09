import { Send, Square } from "lucide-react";
import { FormEvent, useState } from "react";

export function ChatComposer({
  disabled,
  isStreaming,
  onSubmit,
  onStop
}: {
  disabled?: boolean;
  isStreaming: boolean;
  onSubmit: (question: string) => void;
  onStop: () => void;
}) {
  const [question, setQuestion] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setQuestion("");
  };

  return (
    <form className="composer glass-panel" onSubmit={submit}>
      <textarea
        value={question}
        disabled={disabled}
        placeholder="Ask about your documents, selected collection, or general knowledge..."
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) submit(event);
        }}
      />
      <button type={isStreaming ? "button" : "submit"} onClick={isStreaming ? onStop : undefined} aria-label={isStreaming ? "Stop response" : "Send message"}>
        {isStreaming ? <Square size={18} /> : <Send size={18} />}
      </button>
    </form>
  );
}
