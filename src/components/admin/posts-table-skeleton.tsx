import { Skeleton } from "@/components/ui/skeleton";

export function PostsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading posts…
      </p>
      <div aria-hidden="true" className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index} className="border-t border-border">
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="mt-1.5 h-3 w-32" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
