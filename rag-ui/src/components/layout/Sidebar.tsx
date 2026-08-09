import { Database, FileText, MessageSquarePlus, MessagesSquare, Settings, Sparkles } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { chatStore, collectionStore, documentStore } from "../../lib/storage";
import { createId } from "../../lib/http";

export function Sidebar() {
  const navigate = useNavigate();
  const sessions = chatStore.all().slice(0, 8);
  const documents = documentStore.all().slice(0, 5);
  const collections = collectionStore.all().slice(0, 5);

  const startNewChat = () => {
    const now = new Date().toISOString();
    const session = {
      id: createId("chat"),
      title: "New conversation",
      createdAt: now,
      updatedAt: now,
      messages: []
    };
    chatStore.save([session, ...chatStore.all()]);
    navigate(`/chat?session=${session.id}`);
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={20} />
        </div>
        <div>
          <strong>RAG Assistant</strong>
          <span>Enterprise Knowledge AI</span>
        </div>
      </div>

      <button className="primary-action" onClick={startNewChat}>
        <MessageSquarePlus size={18} />
        New Chat
      </button>

      <nav className="nav-list">
        <NavLink to="/chat">
          <MessagesSquare size={18} />
          Chat
        </NavLink>
        <NavLink to="/documents">
          <FileText size={18} />
          Documents
        </NavLink>
        <NavLink to="/collections">
          <Database size={18} />
          Collections
        </NavLink>
        <NavLink to="/settings">
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-section">
        <span className="section-label">Chat history</span>
        {sessions.length ? (
          sessions.map((session) => (
            <NavLink className="sidebar-row" to={`/chat?session=${session.id}`} key={session.id}>
              {session.title}
            </NavLink>
          ))
        ) : (
          <p className="muted">No chats yet</p>
        )}
      </div>

      <div className="sidebar-section">
        <span className="section-label">Collections</span>
        {collections.length ? collections.map((collection) => <span className="sidebar-row" key={collection.id}>{collection.name}</span>) : <p className="muted">Create folders for focused search</p>}
      </div>

      <div className="sidebar-section sidebar-documents">
        <span className="section-label">Documents</span>
        {documents.length ? documents.map((document) => <span className="sidebar-row" key={document.id}>{document.fileName}</span>) : <p className="muted">Upload PDFs to start</p>}
      </div>
    </aside>
  );
}
