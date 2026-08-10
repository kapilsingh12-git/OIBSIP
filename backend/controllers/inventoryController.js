import Inventory from '../models/Inventory.js';
import { checkLowStock } from '../utils/lowStockChecker.js';

// @desc    Get all inventory items (Admin only)
// @route   GET /api/inventory
export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ itemName: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add new inventory item (Admin only)
// @route   POST /api/inventory
export const addInventoryItem = async (req, res) => {
  try {
    const { itemName, category, quantity, unit, threshold } = req.body;
    const item = await Inventory.create({ itemName, category, quantity, unit, threshold });
    res.status(201).json({ success: true, message: 'Inventory item added', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update inventory item (manual stock update) (Admin only)
// @route   PUT /api/inventory/:id
export const updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const { quantity, threshold, unit } = req.body;
    if (quantity !== undefined) {
      item.quantity = quantity;
      item.lastRestocked = Date.now();
    }
    if (threshold !== undefined) item.threshold = threshold;
    if (unit) item.unit = unit;

    await item.save();

    // Check if this update triggers a low-stock alert
    await checkLowStock();

    res.status(200).json({ success: true, message: 'Inventory updated', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete inventory item (Admin only)
// @route   DELETE /api/inventory/:id
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};