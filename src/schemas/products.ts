import { z } from 'zod/v4';
import mongoose, { Types } from 'mongoose';

export const productInputSchema = z.strictObject({
  name: z
    .string({ error: 'Product name must be a string' })
    .min(2, { message: 'Product name is required and must be at least 2 characters long' }),
  description: z
    .string({ error: 'Product description must be a string' })
    .min(2, { message: 'Product description is required and must be at least 2 characters long' }),
  price: z
    .number({ error: 'Product price must be a number' })
    .positive({ message: 'Product price is required and must be gerater than 0' }),
  categoryId: z
    .any()
    .refine(val => (typeof val === 'string' && /^[a-fA-F0-9]{24}$/.test(val)) || val instanceof Types.ObjectId, {
      message: 'Category ID must be a valid ObjectId'
    }),
  isActive: z.boolean().default(true)
});

export const productSchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  ...productInputSchema.shape,
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.number()
});
