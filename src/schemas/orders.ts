import { z } from 'zod/v4';

const objectIdString = z
  .string({ error: 'id must be a string' }) // verhindert objectId: 123
  .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid id format' }); // verhindert objectId: "abc"

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           format: ObjectId
 *           example: "64b7c9f5a1c2e90012ab34cd"
 *           description: ID of the product
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *           description: Quantity of the product (must be at least 1)
 *       required:
 *         - productId
 *         - quantity
 */

export const orderItemInputSchema = z.strictObject({
  productId: objectIdString,
  quantity: z.number({ error: 'quantity must be a number' }).int().min(1, { message: 'quantity must be >= 1' })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: ID of the user who placed the order
 *         items:
 *           type: array
 *           minItems: 1
 *           description: List of ordered items (productId must be unique)
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - paid
 *             - shipped
 *             - cancelled
 *           example: "pending"
 *           description: Current order status
 *         note:
 *           type: string
 *           maxLength: 500
 *           example: "Please deliver after 5 PM"
 *           description: Optional note for the order
 *       required:
 *         - userId
 *         - items
 */

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
