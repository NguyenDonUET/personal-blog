import { EditPostContent } from "./edit-post-content";

type EditPostPageContentProps = {
  params: Promise<{ id: string }>;
};

export async function EditPostPageContent({ params }: EditPostPageContentProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <p className="text-sm text-muted-foreground">Update markdown content and metadata.</p>
      </div>
      <EditPostContent id={id} />
    </div>
  );
}
