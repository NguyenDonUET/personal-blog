import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

const paragraphWidths = [
  ["w-full", "w-full", "w-5/6"],
  ["w-full", "w-11/12", "w-full", "w-2/3"],
  ["w-full", "w-full", "w-3/4"],
];

export function ArticleViewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p role="status" className="sr-only">
        Loading article…
      </p>
      <div aria-hidden="true">
        <div className="space-y-3 border-b border-neutral-300/70 pb-6 dark:border-neutral-700">
          <Skeleton className="h-9 w-11/12 sm:h-10" />
          <Skeleton className="h-9 w-1/2 sm:h-10" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="mt-8 space-y-6">
          {paragraphWidths.map((lines, paragraphIndex) => (
            <div key={paragraphIndex} className="space-y-2">
              {lines.map((width, lineIndex) => (
                <Skeleton key={lineIndex} className={cn("h-4", width)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
