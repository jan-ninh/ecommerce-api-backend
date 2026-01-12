import { type RequestHandler } from 'express';
import { Order, User, Product } from '#models';
import { orderInputSchema } from '#schemas';
import { z } from 'zod/v4';

type OrderInputDTO = z.infer<typeof orderInputSchema>;

function computeTotal(items: Array<{ unitPrice: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

async function buildSnapshotItemsOrThrow(items: OrderInputDTO['items']) {
  const productIds = items.map(i => i.productId);

  const products = await Product.find({ _id: { $in: productIds } }).select('name price');
  const productMap = new Map<string, { name: string; price: number }>(
    products.map(p => [p._id.toString(), { name: p.name, price: p.price }])
  );

  // Error by first missing product
  for (const item of items) {
    if (!productMap.has(item.productId)) {
      throw new Error('Product not found', { cause: 404 });
    }
  }

  return items.map(item => {
    const p = productMap.get(item.productId)!;
    return {
      productId: item.productId,
      title: p.name,
      unitPrice: p.price,
      quantity: item.quantity
    };
  });
}

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

export const createOrder: RequestHandler<{}, any, OrderInputDTO> = async (req, res) => {
  const { userId, items, status, note } = req.body;

  // check valid user
  const userExists = await User.findById(userId);
  if (!userExists) throw new Error('User not found', { cause: 404 });

  // check valid product (productId, title, unitPrice, quantity)
  const snapshotItems = await buildSnapshotItemsOrThrow(items);
  const total = computeTotal(snapshotItems);

  const order = await Order.create({
    userId,
    items: snapshotItems,
    status,
    note,
    total
  });

  res.status(201).json(order);
};

export const getOrderById: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found', { cause: 404 });

  res.json(order);
};

export const updateOrder: RequestHandler<{ id: string }, any, OrderInputDTO> = async (req, res) => {
  const {
    params: { id },
    body
  } = req;

  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found', { cause: 404 });

  const userExists = await User.findById(body.userId);
  if (!userExists) throw new Error('User not found', { cause: 404 });

  const snapshotItems = await buildSnapshotItemsOrThrow(body.items);
  const total = computeTotal(snapshotItems);

  order.userId = body.userId as any;
  order.items = snapshotItems as any;
  order.total = total as any;
  order.status = body.status ?? order.status;
  order.note = body.note ?? order.note;

  await order.save();
  res.json(order);
};

export const deleteOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error('Order not found', { cause: 404 });

  res.json({ message: 'Order deleted' });
};
