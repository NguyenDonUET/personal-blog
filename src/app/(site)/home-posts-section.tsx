import { connection } from "next/server";
import { ArticleCard } from "@/components/article-card";
import { getPosts } from "@/lib/posts";

export async function HomePostsSection() {
  await connection();
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 5);

  return (
    <section className="mt-12">
      <h1 className="text-xl font-semibold sm:text-2xl">Latest Articles</h1>
      <div className="mt-6 grid gap-4">
        {latestPosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
