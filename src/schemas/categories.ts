import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const categoryInputSchema = z
  .object({
    name: z.string({ error: 'Category name must be a string' }).min(1, {
      message: 'Category name is required'
    })
  })
  .strict();

export const categorySchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...categoryInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
