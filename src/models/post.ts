import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type PostRecord = InferSchemaType<typeof postSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PostModel =
  (mongoose.models.Post as Model<PostRecord>) ??
  mongoose.model<PostRecord>("Post", postSchema);
