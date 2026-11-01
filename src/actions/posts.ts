"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { connectDB, isDbConfigured } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { PostModel } from "@/models/post";
import type { CreatePostInput, UpdatePostInput } from "@/types/post";

export type PostActionState = {
  error?: string;
};

function parsePostInput(input: CreatePostInput) {
  const title = input.title.trim();
  const slug = (input.slug.trim() || slugify(title)).toLowerCase();
  const description = input.description.trim();
  const content = input.content.trim();
  const publishedAt = new Date(input.publishedAt);

  if (!title || !slug || !description || !content) {
    throw new Error("All fields are required.");
  }

  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Invalid publish date.");
  }

  return { title, slug, description, content, publishedAt };
}

function ensureDb() {
  if (!isDbConfigured()) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI to manage posts.",
    );
  }
}

export async function createPostAction(
  input: CreatePostInput,
): Promise<PostActionState> {
  try {
    await requireAuth();
    ensureDb();
    const data = parsePostInput(input);

    await connectDB();
    await PostModel.create(data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create post.",
    };
  }

  redirect("/admin");
}

export async function updatePostAction(
  input: UpdatePostInput,
): Promise<PostActionState> {
  try {
    await requireAuth();
    ensureDb();
    const data = parsePostInput(input);

    await connectDB();
    const existing = await PostModel.findById(input.id);
    if (!existing) {
      throw new Error("Post not found.");
    }

    const previousSlug = existing.slug;
    existing.title = data.title;
    existing.slug = data.slug;
    existing.description = data.description;
    existing.content = data.content;
    existing.publishedAt = data.publishedAt;
    await existing.save();

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${previousSlug}`);
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin");
    revalidatePath(`/admin/posts/${input.id}/edit`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update post.",
    };
  }

  redirect("/admin");
}

export async function deletePostAction(id: string): Promise<PostActionState> {
  try {
    await requireAuth();
    ensureDb();

    await connectDB();
    const existing = await PostModel.findById(id);
    if (!existing) {
      throw new Error("Post not found.");
    }

    const slug = existing.slug;
    await existing.deleteOne();

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete post.",
    };
  }

  redirect("/admin");
}
