import { z } from 'zod/v4';
import { objectIdString } from './common.ts';

// Validiert req.params.id (muss 24-hex ObjectId-String sein)
export const userIdParamsSchema = z.strictObject({
  id: objectIdString
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UserCreateInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Max"
 *           description: First name of the user
 *           minLength: 2
 *         lastName:
 *           type: string
 *           example: "Mustermann"
 *           description: Last name of the user
 *           minLength: 2
 *         email:
 *           type: string
 *           format: email
 *           example: "max.mustermann@example.com"
 *           description: Email address of the user
 *         password:
 *           type: string
 *           format: password
 *           example: "strongPassword123"
 *           description: Password of the user (minimum 8 characters)
 *           minLength: 8
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Indicates whether the user is active
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 */

export const userCreateSchema = z.strictObject({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  isActive: z.boolean().optional()
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Max"
 *           minLength: 2
 *           description: Updated first name of the user
 *         lastName:
 *           type: string
 *           example: "Mustermann"
 *           minLength: 2
 *           description: Updated last name of the user
 *         email:
 *           type: string
 *           format: email
 *           example: "max.new@example.com"
 *           description: Updated email address of the user
 *         isActive:
 *           type: boolean
 *           example: false
 *           description: Indicates whether the user is active
 */

export const userUpdateSchema = z.strictObject({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.email().optional(),
  isActive: z.boolean().optional()
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UserPublicOutput:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64b7c9f5a1c2e90012ab34cd"
 *           description: Unique identifier of the user
 *         firstName:
 *           type: string
 *           example: "Max"
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           example: "Mustermann"
 *           description: Last name of the user
 *         email:
 *           type: string
 *           format: email
 *           example: "max.mustermann@example.com"
 *           description: Email address of the user
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Indicates whether the user is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T12:00:00Z"
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-19T09:30:00Z"
 *           description: User last update timestamp
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *         - isActive
 *         - createdAt
 *         - updatedAt
 */

// Response (Public DTO ohne PW)
export const userPublicSchema = z.strictObject({
  id: z.string(), // cleanResponse
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
