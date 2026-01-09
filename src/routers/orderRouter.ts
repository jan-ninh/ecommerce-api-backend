import { Router } from 'express';
import { getOrders, createOrder, getOrderById, updateOrder, deleteOrder } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { orderInputSchema } from '#schemas';

const orderRouter = Router();

orderRouter.get('/', getOrders);
orderRouter.post('/', validateBodyZod(orderInputSchema), createOrder);

orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', validateBodyZod(orderInputSchema), updateOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;
