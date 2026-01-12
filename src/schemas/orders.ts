import { z } from 'zod/v4';

const objectIdString = z
  .string({ error: 'id must be a string' }) // verhindert objectId: 123
  .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid id format' }); // verhindert objectId: "abc"

export const orderItemInputSchema = z.strictObject({
  productId: objectIdString,
  quantity: z.number({ error: 'quantity must be a number' }).int().min(1, { message: 'quantity must be >= 1' })
});

export const orderInputSchema = z.strictObject({
  userId: objectIdString,
  items: z
    .array(orderItemInputSchema)
    .min(1, { message: 'items must contain at least 1 item' })
    .superRefine((items, ctx) => {
      const seen = new Set<string>();

      for (const [i, item] of items.entries()) {
        const key = item.productId.toLowerCase();

        if (seen.has(key)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Duplicate productId in items',
            path: [i, 'productId']
          });
          return;
        }

        seen.add(key);
      }
    }),
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled']).optional(),
  note: z.string().max(500).optional()
});
