import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-300/70 bg-card p-5 dark:border-neutral-700">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-3 h-4 w-28" />
      <div className="mt-4 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 sm:hidden" />
      </div>
    </div>
  );
}

type ArticleListSkeletonProps = {
  count?: number;
  className?: string;
};

export function ArticleListSkeleton({ count = 3, className }: ArticleListSkeletonProps) {
  return (
    <div className={className}>
      <p role="status" className="sr-only">
        Loading articles…
      </p>
      <div aria-hidden="true" className="grid gap-4">
        {Array.from({ length: count }, (_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}