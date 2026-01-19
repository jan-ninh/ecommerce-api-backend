import { Router } from 'express';
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '#controllers';
import { validateBodyZod, validateParamsZod, validateQueryZod } from '#middlewares';
import { categoryInputSchema, categoryIdParamsSchema, emptyQuerySchema } from '#schemas';

const categoryRouter = Router();

categoryRouter.get('/', validateQueryZod(emptyQuerySchema), getCategories);
categoryRouter.post('/', validateQueryZod(emptyQuerySchema), validateBodyZod(categoryInputSchema), createCategory);
categoryRouter.get(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(categoryIdParamsSchema),
  getCategoryById
);
categoryRouter.put(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(categoryIdParamsSchema),
  validateBodyZod(categoryInputSchema),
  updateCategory
);
categoryRouter.delete(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(categoryIdParamsSchema),
  deleteCategory
);

export default categoryRouter;
