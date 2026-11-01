import { Suspense } from "react";
import { EditPostPageContent } from "./edit-post-page-content";
import { EditPostPageSkeleton } from "./edit-post-page-skeleton";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <Suspense fallback={<EditPostPageSkeleton />}>
      <EditPostPageContent params={params} />
    </Suspense>
  );
}
