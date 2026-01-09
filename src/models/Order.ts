import { Schema, model, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    // Item-Daten werden erstmal in der Order gespeichert (ohne Product Item)
    title: { type: String, required: [true, 'Item title is required'], trim: true },
    unitPrice: { type: Number, required: [true, 'unitPrice is required'], min: [0, 'unitPrice must be >= 0'] },
    quantity: { type: Number, required: [true, 'quantity is required'], min: [1, 'quantity must be >= 1'] },

    // für später wenn Products da sind
    productId: { type: String, required: false }
  },
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

    // server-side berechnung
    total: { type: Number, required: true, min: [0, 'total must be >= 0'] }
  },
  { timestamps: true }
);

// total immer aus items berechnen (Client nicht vertrauen)
orderSchema.pre('validate', function (next) {
  // "this" ist das aktuelle Dokument
  const doc = this as any;
  const items = Array.isArray(doc.items) ? doc.items : [];

  doc.total = items.reduce((sum: number, item: any) => {
    const price = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + price * qty;
  }, 0);

  next();
});

export type OrderDoc = InferSchemaType<typeof orderSchema>;
const Order = model<OrderDoc>('Order', orderSchema);

export default Order;
