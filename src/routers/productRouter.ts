import { Router } from 'express';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { productInputSchema } from '#schemas';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', validateBodyZod(productInputSchema), createProduct);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', validateBodyZod(productInputSchema), updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
