import { Suspense } from "react";
import postsJson from "@/data/posts.json";
import { BlogPostContent } from "./blog-post-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return postsJson.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = postsJson.find((entry) => entry.slug === slug);

  return {
    title: post ? `${post.title} | Paulina's Blog` : "Paulina's Blog",
    description: post?.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Loading article…
          </p>
        </div>
      }
    >
      <BlogPostContent params={params} />
    </Suspense>
  );
}
