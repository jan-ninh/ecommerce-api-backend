import { Router } from 'express';
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { categoryInputSchema } from '#schemas';

const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.post('/', validateBodyZod(categoryInputSchema), createCategory);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.put('/:id', validateBodyZod(categoryInputSchema), updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
