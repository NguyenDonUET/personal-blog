import { MarkdownContent } from "@/components/markdown-content";
import { formatPostDate } from "@/lib/format-date";
import type { Post } from "@/types/post";

type ArticleViewProps = Pick<Post, "title" | "publishedAt" | "description" | "content">;

export function ArticleView({ title, publishedAt, description, content }: ArticleViewProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3 border-b border-neutral-300/70 pb-6 dark:border-neutral-700">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
        {publishedAt ? (
          <time
            dateTime={publishedAt}
            className="block text-sm text-neutral-600 dark:text-neutral-400"
          >
            {formatPostDate(publishedAt)}
          </time>
        ) : null}
        {description ? (
          <p className="text-neutral-700 dark:text-neutral-300">{description}</p>
        ) : null}
      </header>
      <div className="mt-8">
        <MarkdownContent content={content} />
      </div>
    </article>
  );
}
