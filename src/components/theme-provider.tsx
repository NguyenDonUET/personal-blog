"use client";

import { useEffect } from "react";
import { resolveTheme, useThemeStore } from "@/store/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((state) => state.preference);

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(preference);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };

    apply();
    document.documentElement.setAttribute("data-theme-ready", "true");

    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);

  return children;
}
