import { FileQuestion, Search, ShieldCheck } from "lucide-react";

const prompts = [
  "Summarize the indexed documents for onboarding a new team member.",
  "Find security-related requirements and cite the source chunks.",
  "Compare the uploaded documents and list conflicting facts."
];

export function WelcomeScreen({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="welcome">
      <div className="welcome-orb">
        <Search size={34} />
      </div>
      <h2>Ask across your knowledge base</h2>
      <p>Choose a search scope, ask a question, and review grounded answers with source citations.</p>
      <div className="prompt-grid">
        {prompts.map((prompt, index) => {
          const Icon = index === 0 ? FileQuestion : index === 1 ? ShieldCheck : Search;
          return (
            <button key={prompt} onClick={() => onPrompt(prompt)}>
              <Icon size={18} />
              {prompt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
