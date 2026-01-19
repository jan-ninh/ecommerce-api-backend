import { z } from 'zod/v4';
import { Types } from 'mongoose';
import { objectIdString } from './common.ts';

export const categoryIdParamsSchema = z.strictObject({
  id: objectIdString
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: "Technology"
 *           description: The name of the category
 *       required:
 *         - name
 */

export const categoryInputSchema = z
  .object({
    name: z.string({ error: 'Category name must be a string' }).min(2, {
      message: 'Category name is required and must be at least 2 characters long'
    })
  })
  .strict();

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: The unique identifier of the category
 *         name:
 *           type: string
 *           example: "Technology"
 *           description: The name of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T12:00:00Z"
 *           description: The date and time when the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T08:30:00Z"
 *           description: The date and time when the category was last updated
 *       required:
 *         - name
 */

export const categorySchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...categoryInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date()
  })
  .strict();
