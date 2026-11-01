import { Suspense } from "react";
import { PostForm } from "@/components/admin/post-form";
import { PostFormSkeleton } from "@/components/admin/post-form-skeleton";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New post</h1>
        <p className="text-sm text-muted-foreground">
          Write in markdown using the editor below.
        </p>
      </div>
      <Suspense fallback={<PostFormSkeleton />}>
        <PostForm />
      </Suspense>
    </div>
  );
}
