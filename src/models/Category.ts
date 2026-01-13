import { Schema, model, type InferSchemaType } from 'mongoose';
import { cleanResponse } from '../db/mongoose.plugins.js';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

categorySchema.plugin(cleanResponse);

export type CategoryDoc = InferSchemaType<typeof categorySchema>;
const Category = model<CategoryDoc>('Category', categorySchema);
export default Category;
