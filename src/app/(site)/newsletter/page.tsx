import { NewsletterForm } from "@/components/newsletter-form";

export const metadata = {
  title: "Newsletter | John's Blog",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Newsletter</h1>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          Want to stay updated on my latest articles, coding tutorials, and personal
          adventures? Sign up for my newsletter. Just drop your email in the sign-up box,
          and I&apos;ll send you updates whenever there&apos;s something new to share.
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Unsubscribe anytime. No spam, I promise 🙂
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-neutral-300/70 bg-card p-6 dark:border-neutral-700">
        <NewsletterForm />
      </div>
    </div>
  );
}
