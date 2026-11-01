import Link from "next/link";
import { Suspense } from "react";
import { AdminPostsTable } from "./admin-posts-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and delete blog posts.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className={cn(
            buttonVariants(),
            "bg-yellow-500 text-neutral-900 hover:bg-yellow-400",
          )}
        >
          New post
        </Link>
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading posts…</p>}>
        <AdminPostsTable />
      </Suspense>
    </div>
  );
}
