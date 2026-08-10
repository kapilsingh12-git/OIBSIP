import Pizza from '../models/Pizza.js';
import PizzaOption from '../models/PizzaOption.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all pizzas (with optional category filter)
// @route   GET /api/pizzas
export const getPizzas = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { available: true };
    if (category) filter.category = category;

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single pizza
// @route   GET /api/pizzas/:id
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all pizza customization options (base, sauce, cheese, veggie)
// @route   GET /api/pizzas/options
export const getPizzaOptions = async (req, res) => {
  try {
    const options = await PizzaOption.find({ available: true });
    // Group by type for easier frontend consumption
    const grouped = options.reduce((acc, opt) => {
      if (!acc[opt.type]) acc[opt.type] = [];
      acc[opt.type].push(opt);
      return acc;
    }, {});
    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create pizza (Admin only)
// @route   POST /api/pizzas
export const createPizza = async (req, res) => {
  try {
    const { name, description, category, basePrice, isCustomizable } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'pizza-delivery' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const pizza = await Pizza.create({
      name,
      description,
      category,
      basePrice,
      isCustomizable,
      image: imageUrl,
    });

    res.status(201).json({ success: true, message: 'Pizza created successfully', data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update pizza (Admin only)
// @route   PUT /api/pizzas/:id
export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    const { name, description, category, basePrice, isCustomizable, available } = req.body;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'pizza-delivery' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      pizza.image = result.secure_url;
    }

    if (name) pizza.name = name;
    if (description) pizza.description = description;
    if (category) pizza.category = category;
    if (basePrice) pizza.basePrice = basePrice;
    if (isCustomizable !== undefined) pizza.isCustomizable = isCustomizable;
    if (available !== undefined) pizza.available = available;

    await pizza.save();
    res.status(200).json({ success: true, message: 'Pizza updated successfully', data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete pizza (Admin only) - soft delete pattern
// @route   DELETE /api/pizzas/:id
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    // Soft delete: mark unavailable instead of removing document
    pizza.available = false;
    await pizza.save();

    res.status(200).json({ success: true, message: 'Pizza removed from menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// @desc    Create pizza option (Admin only)
// @route   POST /api/pizzas/options
export const createPizzaOption = async (req, res) => {
  try {
    const { type, name, extraPrice } = req.body;
    const option = await PizzaOption.create({ type, name, extraPrice });
    res.status(201).json({ success: true, message: 'Option added', data: option });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete pizza option (Admin only)
// @route   DELETE /api/pizzas/options/:id
export const deletePizzaOption = async (req, res) => {
  try {
    await PizzaOption.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Option deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};