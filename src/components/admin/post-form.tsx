"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { cn } from "cn";
import {
  createPostAction,
  updatePostAction,
  type PostActionState,
} from "@/actions/posts";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ArticleView } from "@/components/article-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { slugify } from "@/lib/slugify";
import type { PostDocument } from "@/types/post";

type PostFormProps = {
  post?: PostDocument;
};

const isE2E = process.env.NEXT_PUBLIC_E2E === "true";
const previewClassName = "rounded-lg border border-border bg-background text-base";

export function PostForm({ post }: PostFormProps) {
  const isEditing = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 10)
      : "",
  );

  useEffect(() => {
    if (!post && !publishedAt) {
      setPublishedAt(new Date().toISOString().slice(0, 10));
    }
  }, [post, publishedAt]);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const isWide = useMediaQuery("(min-width: 1024px)");
  // Lets typing stay responsive while react-markdown re-parses long posts.
  const previewContent = useDeferredValue(content);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing && !slug.trim()) {
      setSlug(slugify(value));
    }
  };

  const submit = () => {
    setError(undefined);
    startTransition(async () => {
      let result: PostActionState | undefined;
      if (isEditing && post) {
        result = await updatePostAction({
          id: post._id,
          title,
          slug,
          description,
          content,
          publishedAt: new Date(publishedAt).toISOString(),
        });
      } else {
        result = await createPostAction({
          title,
          slug,
          description,
          content,
          publishedAt: new Date(publishedAt).toISOString(),
        });
      }
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const contentLabel = <Label htmlFor={isE2E ? "content" : undefined}>Content</Label>;

  const editor = isE2E ? (
    <textarea
      id="content"
      data-testid="markdown-editor"
      className="min-h-[320px] w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground"
      value={content}
      onChange={(event) => setContent(event.target.value)}
    />
  ) : (
    <MarkdownEditor value={content} onChange={setContent} />
  );

  const preview = previewContent.trim() ? (
    <ArticleView
      title={title.trim() || "Untitled post"}
      publishedAt={publishedAt}
      description={description}
      content={previewContent}
    />
  ) : (
    <p className="px-4 py-10 text-center text-sm text-muted-foreground">
      Nothing to preview yet. Write some content first.
    </p>
  );

  return (
    <div className="space-y-6">
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Published date</Label>
          <Input
            id="publishedAt"
            type="date"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </div>

      {isWide ? (
        <div className="space-y-3">
          {contentLabel}
          <div className="grid grid-cols-2 items-start gap-4">
            {editor}
            <section
              aria-label="Preview"
              tabIndex={0}
              data-testid="post-preview"
              className={cn(previewClassName, "sticky top-4 max-h-[80vh] overflow-y-auto")}
            >
              {preview}
            </section>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="write" className="gap-3">
          <div className="flex items-center justify-between gap-4">
            {contentLabel}
            <TabsList aria-label="Content view">
              <TabsTrigger value="write" className="px-3">
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="px-3">
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="write">{editor}</TabsContent>
          <TabsContent value="preview" data-testid="post-preview" className={previewClassName}>
            {preview}
          </TabsContent>
        </Tabs>
      )}

      <Button
        type="button"
        data-testid="post-submit"
        disabled={isPending}
        onClick={submit}
        className="bg-yellow-500 text-neutral-900 hover:bg-yellow-400"
      >
        {isPending ? "Saving…" : isEditing ? "Update post" : "Create post"}
      </Button>
    </div>
  );
}
