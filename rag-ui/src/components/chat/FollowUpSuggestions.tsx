const suggestions = [
  "Show source-only evidence",
  "Turn this into an executive summary",
  "What should I verify next?"
];

export function FollowUpSuggestions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="follow-ups">
      {suggestions.map((suggestion) => (
        <button key={suggestion} onClick={() => onSelect(suggestion)}>
          {suggestion}
        </button>
      ))}
    </div>
  );
}
