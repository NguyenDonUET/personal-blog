import Image from "next/image";

export const metadata = {
  title: "About | John's Blog",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold">About Me</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        <p>
          Hi, I&apos;m John! Ever since I can remember, I&apos;ve had a passion for
          creativity and problem-solving. That&apos;s what led me to the world of front-end
          web development.
        </p>
        <p>
          When I&apos;m not coding, I love getting lost in a good book, hiking, and rock
          climbing. Those activities help me reset and tackle tough coding challenges
          with fresh energy.
        </p>
        <p className="font-medium text-foreground">Some of my favorite books:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <em>The Pragmatic Programmer</em> by Andrew Hunt and David Thomas
          </li>
          <li>
            <em>Ready Player One</em> by Ernest Cline
          </li>
          <li>
            <em>The Hobbit</em> by J.R.R. Tolkien
          </li>
          <li>
            <em>Educated</em> by Tara Westover
          </li>
        </ul>
        <p>
          I absolutely love my workspace as a place that inspires me to do my best work,
          so I thought I&apos;d share it with you:
        </p>
        <figure className="space-y-3">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="/assets/images/image-workspace-large.jpg"
            />
            <Image
              src="/assets/images/image-workspace-small.jpg"
              alt="John's workspace with laptop, plants, and warm lighting"
              width={768}
              height={512}
              className="w-full rounded-xl border border-neutral-300/70 dark:border-neutral-700"
            />
          </picture>
        </figure>
        <p>
          I hope this blog not only documents my growth but also helps others see that
          coding can be for everyone. Thanks for joining me on this journey!
        </p>
      </div>
    </div>
  );
}
