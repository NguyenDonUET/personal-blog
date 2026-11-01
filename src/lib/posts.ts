import { connectDB, isDbConfigured } from "@/lib/db";
import {
  getStaticPostBySlug,
  getStaticPosts,
  getStaticPostSlugs,
} from "@/lib/posts-static";
import { PostModel, type PostRecord } from "@/models/post";
import type { Post, PostDocument } from "@/types/post";

function toPostDocument(record: PostRecord): PostDocument {
  return {
    _id: record._id.toString(),
    title: record.title,
    slug: record.slug,
    description: record.description,
    content: record.content,
    publishedAt: record.publishedAt.toISOString(),
    createdAt: record.createdAt?.toISOString(),
    updatedAt: record.updatedAt?.toISOString(),
  };
}

function toPost(record: PostRecord): Post {
  const doc = toPostDocument(record);
  const { _id, createdAt, updatedAt, ...post } = doc;
  void _id;
  void createdAt;
  void updatedAt;
  return post;
}

export async function getPosts(): Promise<Post[]> {
  if (!isDbConfigured()) {
    return getStaticPosts();
  }

  await connectDB();
  const records = await PostModel.find().sort({ publishedAt: -1 }).lean();
  return records.map((record) =>
    toPost({
      ...record,
      _id: record._id,
      publishedAt: new Date(record.publishedAt),
    } as PostRecord),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isDbConfigured()) {
    return getStaticPostBySlug(slug) ?? null;
  }

  await connectDB();
  const record = await PostModel.findOne({ slug }).lean();
  if (!record) return null;

  return toPost({
    ...record,
    _id: record._id,
    publishedAt: new Date(record.publishedAt),
  } as PostRecord);
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isDbConfigured()) {
    return getStaticPostSlugs();
  }

  await connectDB();
  const records = await PostModel.find({}, { slug: 1 }).lean();
  return records.map((record) => record.slug);
}

export async function getPostsForAdmin(): Promise<PostDocument[]> {
  if (!isDbConfigured()) {
    return getStaticPosts().map((post, index) => ({
      ...post,
      _id: `static-${index}`,
    }));
  }

  await connectDB();
  const records = await PostModel.find().sort({ publishedAt: -1 }).lean();
  return records.map((record) =>
    toPostDocument({
      ...record,
      _id: record._id,
      publishedAt: new Date(record.publishedAt),
    } as PostRecord),
  );
}

export async function getPostByIdForAdmin(
  id: string,
): Promise<PostDocument | null> {
  if (!isDbConfigured()) {
    return null;
  }

  await connectDB();
  const record = await PostModel.findById(id).lean();
  if (!record) return null;

  return toPostDocument({
    ...record,
    _id: record._id,
    publishedAt: new Date(record.publishedAt),
  } as PostRecord);
}
