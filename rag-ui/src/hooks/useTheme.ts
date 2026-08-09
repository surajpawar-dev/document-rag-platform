import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("rag-ui.theme") as Theme) || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("rag-ui.theme", theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")) };
}
