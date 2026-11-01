"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme-store";

export function ThemeToggle() {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="border-neutral-400 bg-transparent text-neutral-800 hover:bg-neutral-200 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </Button>
  );
}
