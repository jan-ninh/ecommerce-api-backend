import { z } from 'zod/v4';

const objectIdString = z
  .string({ error: 'id must be a string' })
  .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid id format' });

/**
 * Info für API:
 * Client soll productId + quantity schicken
 * title/unitPrice sind optional (weil Total server-side berechnet werden sollte)
 */
export const orderItemInputSchema = z.strictObject({
  productId: objectIdString,
  quantity: z.number({ error: 'quantity must be a number' }).int().min(1, { message: 'quantity must be >= 1' }),

  title: z.string({ error: 'title must be a string' }).min(1).optional(),
  unitPrice: z.number({ error: 'unitPrice must be a number' }).min(0).optional()
});

export const orderInputSchema = z.strictObject({
  userId: objectIdString,
  items: z.array(orderItemInputSchema).min(1, { message: 'items must contain at least 1 item' }),
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled']).optional(),
  note: z.string().max(500).optional()
});
