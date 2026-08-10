import mongoose from 'mongoose';

const pizzaOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['base', 'sauce', 'cheese', 'veggie'],
      required: true,
    },
    name: { type: String, required: true },
    extraPrice: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PizzaOption = mongoose.model('PizzaOption', pizzaOptionSchema);
export default PizzaOption;