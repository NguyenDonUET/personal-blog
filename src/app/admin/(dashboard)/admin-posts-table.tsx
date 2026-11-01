import Link from "next/link";
import { connection } from "next/server";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { buttonVariants } from "@/components/ui/button";
import { isDbConfigured } from "@/lib/db";
import { formatPostDate } from "@/lib/format-date";
import { getPostsForAdmin } from "@/lib/posts";

export async function AdminPostsTable() {
  await connection();
  const posts = await getPostsForAdmin();
  const dbReady = isDbConfigured();

  return (
    <>
      {!dbReady ? (
        <p
          role="status"
          className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm"
        >
          Set <code className="font-mono">MONGODB_URI</code> in{" "}
          <code className="font-mono">.env.local</code>, then run{" "}
          <code className="font-mono">pnpm seed</code> before creating or editing posts.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-muted-foreground">{post.slug}</div>
                </td>
                <td className="px-4 py-3">{formatPostDate(post.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {dbReady ? (
                      <>
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className={buttonVariants({ size: "sm", variant: "outline" })}
                        >
                          Edit
                        </Link>
                        <DeletePostButton id={post._id} title={post.title} />
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Read-only preview</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
