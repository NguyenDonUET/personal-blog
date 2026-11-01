import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getPostBySlug } from "@/lib/posts";

export async function BlogPostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connection();
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <ArticleView
      title={post.title}
      publishedAt={post.publishedAt}
      description={post.description}
      content={post.content}
    />
  );
}
