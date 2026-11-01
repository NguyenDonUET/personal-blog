import { Suspense } from "react";
import { BlogPostsList } from "./blog-posts-list";

export const metadata = {
  title: "Blog | Paulina's Blog",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold">My Articles</h1>
        <p className="text-neutral-700 dark:text-neutral-300">
          Below are all my recent blog posts. Click on any title to read the full
          article.
        </p>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            Loading articles…
          </p>
        }
      >
        <BlogPostsList />
      </Suspense>
    </div>
  );
}
