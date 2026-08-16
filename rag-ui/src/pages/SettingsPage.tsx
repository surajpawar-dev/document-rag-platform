import { Moon, Sun } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { useTheme } from "../hooks/useTheme";
import { apiConfig } from "../lib/config";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page-stack">
      <PageHeader title="Settings" description="Frontend runtime settings and backend service mapping." />

      <section className="settings-grid">
        <article className="settings-card glass-panel">
          <h2>Appearance</h2>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </button>
        </article>

        <article className="settings-card glass-panel">
          <h2>Backend APIs</h2>
          <dl>
            <dt>Query</dt>
            <dd>{apiConfig.queryBase}/api/v1/query/stream</dd>
            <dt>Upload</dt>
            <dd>{apiConfig.uploadBase}/api/uploads</dd>
            <dt>Documents</dt>
            <dd>{apiConfig.documentsBase}/documents</dd>
            <dt>Embeddings</dt>
            <dd>{apiConfig.embeddingBase}/api/v1/embeddings</dd>
          </dl>
        </article>

        <article className="settings-card glass-panel">
          <h2>Integration Notes</h2>
          <p>General AI sends a direct LLM request through the query service without document retrieval. Document and collection modes use embedding search before calling the LLM.</p>
          <p>Collections are mapped client-side to document IDs until backend collection endpoints are added.</p>
        </article>
      </section>
    </div>
  );
}
