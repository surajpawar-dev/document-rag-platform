import { Outlet } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  useTheme();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-surface">
        <Outlet />
      </main>
    </div>
  );
}
