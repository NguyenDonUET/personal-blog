import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getPostByIdForAdmin } from "@/lib/posts";

export async function EditPostContent({ id }: { id: string }) {
  await connection();
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return <PostForm post={post} />;
}
