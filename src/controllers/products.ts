import { type RequestHandler } from 'express';
import { Product } from '#models';
import { productInputSchema, productSchema } from '#schemas';
import { z } from 'zod/v4';

type ProductInputDTO = z.infer<typeof productInputSchema>;
type ProductDTO = z.infer<typeof productSchema>;

export const getProducts: RequestHandler<{}, ProductDTO[]> = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const createProduct: RequestHandler<{}, ProductDTO, ProductInputDTO> = async (req, res) => {
  /* TODO: anhand welchen Merkmals soll das Erstellen von Dubletten verhindert werden?
    const found = await Product.findOne({ name: req.body.name });
  if (found) throw new Error('Product already exists', { cause: 400 });
  */

  const product = await Product.create(req.body);
  res.json(product);
};

export const getProductById: RequestHandler<{ id: string }, ProductDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  res.json(product);
};

export const updateProduct: RequestHandler<{ id: string }, ProductDTO, ProductInputDTO> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { name, description, price, categoryId, isActive } = body;
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  product.name = name;
  product.description = description;
  product.price = price;
  product.isActive = isActive;
  await product.save();
  res.json(product);
};

export const deleteProduct: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found', { cause: 404 });
  res.json({ message: 'Product deleted' });
};
