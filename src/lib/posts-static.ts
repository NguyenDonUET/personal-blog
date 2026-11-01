import type { Post } from "@/types/post";
import postsJson from "@/data/posts.json";

const staticPosts = postsJson as Post[];

export function getStaticPosts(): Post[] {
  return [...staticPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getStaticPostBySlug(slug: string): Post | undefined {
  return getStaticPosts().find((post) => post.slug === slug);
}

export function getStaticPostSlugs(): string[] {
  return getStaticPosts().map((post) => post.slug);
}
