import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';

// @desc    Create new order (before payment)
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Sanitize items: convert non-ObjectId pizza references (like "custom") to null
    const sanitizedItems = items.map((item) => ({
      ...item,
      pizza: item.pizza && item.pizza !== 'custom' ? item.pizza : undefined,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: sanitizedItems,
      totalAmount,
      deliveryAddress,
    });

    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single order by ID (for tracking)
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user can only view their own order (unless admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update order status (Admin only) + decrement inventory when moving to "In Kitchen"
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Decrement inventory only once, when order moves into "In Kitchen"
    if (status === 'In Kitchen' && previousStatus !== 'In Kitchen') {
      for (const item of order.items) {
        if (item.customization) {
          const { base, sauce, cheese, veggies } = item.customization;
          const ingredientNames = [base, sauce, cheese, ...(veggies || [])].filter(Boolean);

          for (const ingredientName of ingredientNames) {
            await Inventory.findOneAndUpdate(
              { itemName: ingredientName },
              { $inc: { quantity: -item.quantity } }
            );
          }
        }
      }
    }

    // Emit real-time update via Socket.io (attached to req.app in server.js)
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('orderStatusUpdate', { orderId: order._id, status: order.status });
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};