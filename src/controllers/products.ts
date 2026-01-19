import { type RequestHandler } from 'express';
import { Category, Product } from '#models';
import { productInputSchema, productSchema } from '#schemas';
import { z } from 'zod/v4';

type ProductInputDTO = z.infer<typeof productInputSchema>;
type ProductDTO = z.infer<typeof productSchema>;

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Get all products or filter by category
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: string
 *         description: Category ID to filter products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductOutput'
 *       404:
 *         description: Category not found
 */

export const getProducts: RequestHandler<{}, ProductDTO[]> = async (req, res) => {
  const categoryId = req.query.categoryId as string | undefined;

  let categoryValid;
  try {
    categoryValid = (await Category.findOne({ _id: categoryId })) ? true : false;
  } catch (error) {
    throw new Error('Category not found', { cause: 404 });
  }

  let products = categoryValid ? await Product.find({ categoryId }) : await Product.find();

  res.json(products);
};

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     description: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOutput'
 *       404:
 *         description: Category not found
 *       400:
 *         description: Validation error
 */

export const createProduct: RequestHandler<{}, ProductDTO, ProductInputDTO> = async (req, res) => {
  /* TODO: anhand welchen Merkmals soll das Erstellen von Dublikaten verhindert werden?
    const found = await Product.findOne({ name: req.body.name });
  if (found) throw new Error('Product already exists', { cause: 400 });
  */

  const existingCategories = await Category.findOne({ _id: req.body.categoryId });
  if (!existingCategories) throw new Error('Category not found', { cause: 404 });

  const product = await Product.create(req.body);
  res.json(product);
};

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     description: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOutput'
 *       404:
 *         description: Product not found
 */

export const getProductById: RequestHandler<{ id: string }, ProductDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  res.json(product);
};

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     description: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOutput'
 *       404:
 *         description: Product or category not found
 *       400:
 *         description: Validation error
 */

export const updateProduct: RequestHandler<{ id: string }, ProductDTO, ProductInputDTO> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { name, description, price, categoryId, isActive } = body;

  const existingCategories = await Category.findOne({ _id: categoryId });
  if (!existingCategories) throw new Error('Category not found', { cause: 404 });

  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  product.name = name;
  product.description = description;
  product.price = price;
  product.isActive = isActive;
  await product.save();
  res.json(product);
};

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     description: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted"
 *       404:
 *         description: Product not found
 */

export const deleteProduct: RequestHandler<{ id: string }> = async (req, res) => {
  // TODO: delete must fail if product is referenced in order
  const {
    params: { id }
  } = req;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  res.json({ message: 'Product deleted' });
};
