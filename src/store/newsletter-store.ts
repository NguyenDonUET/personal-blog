"use client";

import { create } from "zustand";

export type NewsletterStatus = "idle" | "error" | "success";

type NewsletterState = {
  email: string;
  status: NewsletterStatus;
  message: string;
  setEmail: (email: string) => void;
  submit: () => void;
  reset: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useNewsletterStore = create<NewsletterState>((set, get) => ({
  email: "",
  status: "idle",
  message: "",
  setEmail: (email) => set({ email, status: "idle", message: "" }),
  submit: () => {
    const email = get().email.trim();
    if (!email) {
      set({
        status: "error",
        message: "Email address is required.",
      });
      return;
    }
    if (!emailPattern.test(email)) {
      set({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    set({
      status: "success",
      message: "Thanks for subscribing! You'll hear from me when there's something new.",
    });
  },
  reset: () => set({ email: "", status: "idle", message: "" }),
}));
