import { z } from 'zod/v4';

export const orderItemInputSchema = z.strictObject({
  title: z.string({ error: 'title must be a string' }).min(1, { message: 'title is required' }),
  unitPrice: z.number({ error: 'unitPrice must be a number' }).min(0, { message: 'unitPrice must be >= 0' }),
  quantity: z.number({ error: 'quantity must be a number' }).int().min(1, { message: 'quantity must be >= 1' }),
  productId: z.string().optional()
});

export const orderInputSchema = z.strictObject({
  userId: z.string({ error: 'userId must be a string' }).min(1, { message: 'userId is required' }),
  items: z.array(orderItemInputSchema).min(1, { message: 'items must contain at least 1 item' }),
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled']).optional(),
  note: z.string().max(500).optional()
});
