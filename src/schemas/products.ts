import { z } from 'zod/v4';
import mongoose, { Types } from 'mongoose';

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: "iPhone 15"
 *           description: Name of the product
 *         description:
 *           type: string
 *           minLength: 2
 *           example: "Latest Apple smartphone"
 *           description: Description of the product
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *           description: Price of the product (must be greater than 0)
 *         categoryId:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: Category ID this product belongs to
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Indicates whether the product is active
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: "64b7c9f5a1c2e90012ab34cd"
 *           description: Unique identifier of the product
 *         name:
 *           type: string
 *           example: "iPhone 15"
 *           description: Name of the product
 *         description:
 *           type: string
 *           example: "Latest Apple smartphone"
 *           description: Description of the product
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *           description: Price of the product
 *         categoryId:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: Category ID this product belongs to
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Indicates whether the product is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T12:00:00Z"
 *           description: Product creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T09:30:00Z"
 *           description: Product last update timestamp
 *         __v:
 *           type: number
 *           example: 0
 *           description: Internal document version
 *       required:
 *         - _id
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *         - isActive
 *         - createdAt
 *         - updatedAt
 */

export const productSchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  ...productInputSchema.shape,
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.number()
});
