import { connection } from "next/server";
import { ArticleCard } from "@/components/article-card";
import { getPosts } from "@/lib/posts";

export async function BlogPostsList() {
  await connection();
  const posts = await getPosts();

  return (
    <div className="mt-8 grid gap-4">
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
