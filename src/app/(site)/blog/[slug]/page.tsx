import { Suspense } from "react";
import postsJson from "@/data/posts.json";
import { ArticleViewSkeleton } from "@/components/article-view-skeleton";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";import { BlogPostContent } from "./blog-post-content";

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
    title: post ? `${post.title} | John's Blog` : "John's Blog",
    description: post?.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <>
      <Suspense fallback={<ArticleViewSkeleton />}>
        <BlogPostContent params={params} />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
}
