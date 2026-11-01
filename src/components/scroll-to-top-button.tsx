"use client";

import { ArrowUpIcon } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const SHOW_AFTER_PX = 600;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function ScrollToTopButton() {
  const isVisible = useSyncExternalStore(
    subscribe,
    () => window.scrollY > SHOW_AFTER_PX,
    () => false,
  );

  if (!isVisible) return null;

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    // Keyboard and screen reader users would otherwise stay on this button at the bottom of the page.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <Button
      type="button"
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed right-4 bottom-4 z-40 size-11 rounded-full bg-yellow-500 text-neutral-900 shadow-lg animate-in fade-in hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 sm:right-6 sm:bottom-6"
    >
      <ArrowUpIcon className="size-5" aria-hidden="true" />
    </Button>
  );
}
