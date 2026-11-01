import Link from "next/link";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

const socialLinks = [
  {
    href: "https://github.com",
    label: "GitHub",
    Icon: GitHubIcon,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "https://x.com",
    label: "X",
    Icon: XIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-300/60 py-8 dark:border-neutral-700">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          © 2026 John. Learning in public.
        </p>
        <ul className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-md text-neutral-800 transition-colors hover:text-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 dark:text-neutral-100 dark:hover:text-yellow-400"
                aria-label={link.label}
              >
                <link.Icon className="size-5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
