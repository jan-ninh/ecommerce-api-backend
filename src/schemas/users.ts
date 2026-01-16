import { z } from 'zod/v4';

export const userCreateSchema = z.strictObject({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  isActive: z.boolean().optional()
});

export const userUpdateSchema = z.strictObject({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.email().optional(),
  isActive: z.boolean().optional()
});

export const userPublicSchema = z.strictObject({
  id: z.string(), // cleanResponse
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
