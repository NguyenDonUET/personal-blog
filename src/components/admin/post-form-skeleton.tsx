import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function PostFormSkeleton({ label = "Loading form…" }: { label?: string }) {
  return (
    <div>
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSkeleton className="sm:col-span-2" />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton className="sm:col-span-2" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}
