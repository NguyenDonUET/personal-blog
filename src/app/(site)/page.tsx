import { Suspense } from "react";
import { ArticleListSkeleton } from "@/components/article-card-skeleton";
import { HomePostsSection } from "./home-posts-section";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl space-y-4">
        <p className="text-2xl font-semibold sm:text-3xl">Hi, I&apos;m Paulina 👋</p>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          I&apos;m on a journey to become a front-end web developer. I love building
          little projects, trying out new coding techniques, and sharing what I learn
          along the way. When I&apos;m not at my desk, you&apos;ll find me reading, hiking
          through the mountains, or challenging myself on rock-climbing walls.
        </p>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          I started this blog to document my progress, keep myself accountable, and
          hopefully inspire anyone else who&apos;s learning to code. Welcome to my corner
          of the internet, and thanks for stopping by!
        </p>
      </section>

      <Suspense
        fallback={
          <section className="mt-12">
            <h1 className="text-xl font-semibold sm:text-2xl">Latest Articles</h1>
            <ArticleListSkeleton count={5} className="mt-6" />
          </section>
        }
      >
        <HomePostsSection />
      </Suspense>
    </div>
  );
}
