import { Suspense } from "react";
import { EditPostPageContent } from "./edit-post-page-content";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading post…</p>}>
      <EditPostPageContent params={params} />
    </Suspense>
  );
}
