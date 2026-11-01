import Link from "next/link";
import { formatPostDate } from "@/lib/format-date";
import type { Post } from "@/types/post";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl border border-neutral-300/70 bg-card p-5 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-500 dark:border-neutral-700">
      <h2 className="text-lg font-semibold leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="rounded-sm hover:text-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
        >
          {post.title}
        </Link>
      </h2>
      <time
        dateTime={post.publishedAt}
        className="mt-2 block text-sm text-neutral-600 dark:text-neutral-400"
      >
        {formatPostDate(post.publishedAt)}
      </time>
      {post.description ? (
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {post.description}
        </p>
      ) : null}
    </article>
  );
}
