import { PostFormSkeleton } from "@/components/admin/post-form-skeleton";

export function EditPostPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <p className="text-sm text-muted-foreground">Update markdown content and metadata.</p>
      </div>
      <PostFormSkeleton label="Loading post…" />
    </div>
  );
}
