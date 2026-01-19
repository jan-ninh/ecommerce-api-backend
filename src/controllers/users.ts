import type { RequestHandler } from 'express';
import { User } from '#models';
import type { userCreateSchema, userUpdateSchema, userPublicSchema } from '#schemas';
import type { z } from 'zod/v4';

type UserCreateDTO = z.infer<typeof userCreateSchema>;
type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
type UserDTO = z.infer<typeof userPublicSchema>;

function toUserDTO(doc: any): UserDTO {
  // doc kann Mongoose Document sein oder plain object
  const id = typeof doc.id === 'string' ? doc.id : String(doc._id);

  return {
    id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    isActive: doc.isActive ?? true,
    createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : String(doc.createdAt),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : String(doc.updatedAt)
  };
}

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPublicOutput'
 */

export const getUsers: RequestHandler<{}, UserDTO[]> = async (_req, res) => {
  const users = await User.find();
  res.json(users.map(toUserDTO));
};

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublicOutput'
 *       400:
 *         description: User already exists or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 */

export const createUser: RequestHandler<{}, UserDTO, UserCreateDTO> = async (req, res) => {
  const found = await User.findOne({ email: req.body.email });
  if (found) throw new Error('User already exists', { cause: 400 });

  const user = await User.create(req.body);
  res.status(201).json(toUserDTO(user));
};

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublicOutput'
 *       404:
 *         description: User not found
 */

export const getUserById: RequestHandler<{ id: string }, UserDTO> = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new Error('User not found', { cause: 404 });

  res.json(toUserDTO(user));
};

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublicOutput'
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */

export const updateUser: RequestHandler<{ id: string }, UserDTO, UserUpdateDTO> = async (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  const user = await User.findById(id);
  if (!user) throw new Error('User not found', { cause: 404 });

  if (patch.firstName !== undefined) user.firstName = patch.firstName;
  if (patch.lastName !== undefined) user.lastName = patch.lastName;
  if (patch.email !== undefined) user.email = patch.email;
  if (patch.isActive !== undefined) user.isActive = patch.isActive;

  await user.save();
  res.json(toUserDTO(user));
};

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted"
 *       404:
 *         description: User not found
 */

export const deleteUser: RequestHandler<{ id: string }, { message: string }> = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found', { cause: 404 });

  res.json({ message: 'User deleted' });
};
