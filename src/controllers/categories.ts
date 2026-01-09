import type { RequestHandler } from 'express';
import type { z } from 'zod/v4';
import type { UserType } from '#types';
import type { categoryInputSchema, categorySchema } from '#schemas';
import { Category, Product } from '#models';

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryDTO = z.infer<typeof categorySchema>;

export const getCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (req, res) => {
  const category = await Category.create<categoryInputDTO>(req.body);
  res.json(category);
};

export const getCategoryById: RequestHandler<{ id: string }, categoryDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found', { cause: 404 });
  res.json(category);
};

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
