import type { SourceChunk } from "../../lib/types";

export function SourceCitations({ sources }: { sources: SourceChunk[] }) {
  return (
    <div className="citations">
      <span className="section-label">Sources</span>
      {sources.map((source, index) => (
        <details className="citation-card" key={`${source.chunkId}-${index}`}>
          <summary>
            <strong>Document {source.documentId.slice(0, 8)}</strong>
            <span>Chunk {source.chunkOrder}</span>
            <span>{Math.round(source.score * 100)}%</span>
          </summary>
          <p>{source.content}</p>
        </details>
      ))}
    </div>
  );
}
