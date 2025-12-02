import React, { useEffect, useState } from "react";
import ThemeContext from "@/utils/themeUtils";
import type { Theme } from "@/utils/themeTypes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialize state from localStorage
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved || "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (newTheme: Theme) => {
      if (newTheme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", systemPrefersDark);
      } else {
        root.classList.toggle("dark", newTheme === "dark");
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}