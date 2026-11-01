export type Post = {
  title: string;
  slug: string;
  publishedAt: string;
  description: string;
  content: string;
};

export type PostDocument = Post & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePostInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  publishedAt: string;
};

export type UpdatePostInput = CreatePostInput & {
  id: string;
};
