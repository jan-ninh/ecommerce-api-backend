import { Router } from 'express';
import { getOrders, createOrder, getOrderById, updateOrder, deleteOrder } from '#controllers';
import { validateBodyZod, validateParamsZod, validateQueryZod } from '#middlewares';
import { orderInputSchema, orderIdParamsSchema, emptyQuerySchema } from '#schemas';

const orderRouter = Router();

orderRouter.get('/', validateQueryZod(emptyQuerySchema), getOrders);
orderRouter.post('/', validateQueryZod(emptyQuerySchema), validateBodyZod(orderInputSchema), createOrder);
orderRouter.get('/:id', validateQueryZod(emptyQuerySchema), validateParamsZod(orderIdParamsSchema), getOrderById);
orderRouter.put(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(orderIdParamsSchema),
  validateBodyZod(orderInputSchema),
  updateOrder
);
orderRouter.delete('/:id', validateQueryZod(emptyQuerySchema), validateParamsZod(orderIdParamsSchema), deleteOrder);

export default orderRouter;
