import { type RequestHandler } from 'express';
import { Order, User } from '#models';
import { orderInputSchema } from '#schemas';
import { z } from 'zod/v4';

type OrderInputDTO = z.infer<typeof orderInputSchema>;

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

export const createOrder: RequestHandler<{}, any, OrderInputDTO> = async (req, res) => {
  const { userId, items, status, note } = req.body;

  const userExists = await User.findById(userId);
  if (!userExists) throw new Error('User not found', { cause: 400 });

  const order = await Order.create({
    userId,
    items,
    status,
    note
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
  if (!userExists) throw new Error('User not found', { cause: 400 });

  order.userId = body.userId as any;
  order.items = body.items as any;
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
