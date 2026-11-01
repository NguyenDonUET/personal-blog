"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNewsletterStore } from "@/store/newsletter-store";

export function NewsletterForm() {
  const [hydrated, setHydrated] = useState(false);
  const email = useNewsletterStore((state) => state.email);
  const status = useNewsletterStore((state) => state.status);
  const message = useNewsletterStore((state) => state.message);
  const setEmail = useNewsletterStore((state) => state.setEmail);
  const submit = useNewsletterStore((state) => state.submit);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <form
      data-testid="newsletter-form"
      data-hydrated={hydrated ? "true" : undefined}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="newsletter-email">Email Address</Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error"}
          aria-describedby={
            status !== "idle" ? "newsletter-feedback" : undefined
          }
          className="bg-background"
        />
      </div>

      {status !== "idle" ? (
        <p
          id="newsletter-feedback"
          data-testid="newsletter-feedback"
          role={status === "error" ? "alert" : "status"}
          className="flex items-start gap-2 text-sm"
        >
          <Image
            src={
              status === "error"
                ? "/assets/images/icon-error.svg"
                : "/assets/images/icon-success.svg"
            }
            alt=""
            width={20}
            height={20}
            aria-hidden
            className="mt-0.5 shrink-0"
          />
          <span
            className={
              status === "error"
                ? "text-red-700 dark:text-red-300"
                : "text-green-700 dark:text-green-300"
            }
          >
            {message}
          </span>
        </p>
      ) : null}

      <Button
        type="submit"
        className="bg-yellow-500 text-neutral-900 hover:bg-yellow-400"
      >
        Stay updated
      </Button>
    </form>
  );
}
