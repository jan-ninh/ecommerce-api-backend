import { Schema, model, type InferSchemaType } from 'mongoose';
import { cleanResponse } from '../db/mongoose.plugins.js';

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'productId is required']
    },
    quantity: { type: Number, required: [true, 'quantity is required'], min: [1, 'quantity must be >= 1'] },

    // Wichtige Felder fuer Snapshot
    title: { type: String, required: [true, 'Item title is required'], trim: true },
    unitPrice: { type: Number, required: [true, 'unitPrice is required'], min: [0, 'unitPrice must be >= 0'] }
  },
  // bei Items keine eigene ID erzeugen
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'userId is required'] },

    items: {
      type: [orderItemSchema],
      required: [true, 'items are required'],
      validate: [(arr: unknown[]) => Array.isArray(arr) && arr.length > 0, 'At least one item is required']
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'cancelled'],
      default: 'pending'
    },

    note: { type: String, required: false, trim: true },

    // server-side berechnung (Controller)
    total: { type: Number, required: true, min: [0, 'total must be >= 0'] }
  },
  { timestamps: true }
);

orderSchema.plugin(cleanResponse);

export type OrderDoc = InferSchemaType<typeof orderSchema>;
const Order = model<OrderDoc>('Order', orderSchema);

export default Order;
