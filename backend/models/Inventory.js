import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggie'], required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'units' },
    threshold: { type: Number, required: true, default: 20 },
    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

inventorySchema.index({ quantity: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;