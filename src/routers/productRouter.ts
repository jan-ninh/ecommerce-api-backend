import { Router } from 'express';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '#controllers';
import { validateBodyZod, validateParamsZod, validateQueryZod } from '#middlewares';
import { productInputSchema, productIdParamsSchema, productQuerySchema, emptyQuerySchema } from '#schemas';

const productRouter = Router();

productRouter.get('/', validateQueryZod(productQuerySchema), getProducts);
productRouter.post('/', validateQueryZod(emptyQuerySchema), validateBodyZod(productInputSchema), createProduct);
productRouter.get('/:id', validateQueryZod(emptyQuerySchema), validateParamsZod(productIdParamsSchema), getProductById);
productRouter.put(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(productIdParamsSchema),
  validateBodyZod(productInputSchema),
  updateProduct
);
productRouter.delete(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(productIdParamsSchema),
  deleteProduct
);

export default productRouter;
