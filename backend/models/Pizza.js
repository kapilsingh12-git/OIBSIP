import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    basePrice: { type: Number, required: true },
    image: { type: String },
    isCustomizable: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

pizzaSchema.index({ category: 1 });

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;