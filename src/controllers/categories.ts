import type { RequestHandler } from 'express';
import type { z } from 'zod/v4';
import type { categoryInputSchema, categorySchema } from '#schemas';
import { Category, Product } from '#models';

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryDTO = z.infer<typeof categorySchema>;

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     description: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryOutput'
 */

export const getCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

/**
 * @openapi
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     description: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryOutput'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category name is required"
 */

export const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (req, res) => {
  const category = await Category.create<categoryInputDTO>(req.body);
  res.json(category);
};

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     description: Get a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryOutput'
 *       404:
 *         description: Category not found
 */

export const getCategoryById: RequestHandler<{ id: string }, categoryDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });
  res.json(category);
};

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     description: Update a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryOutput'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */

export const updateCategory: RequestHandler<{ id: string }, categoryDTO, categoryInputDTO> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { name } = body;
  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });
  category.name = name;
  await category.save();
  res.json(category);
};

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     description: Delete a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted"
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category cannot be deleted because it has products
 */

export const deleteCategory: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const products = await Product.find({
    categoryId: id
  });
  if (products.length > 0) throw new Error('Category cannot be deleted because it has products', { cause: 409 });
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error('Category not found', { cause: 404 });
  res.json({ message: 'Category deleted' });
};
