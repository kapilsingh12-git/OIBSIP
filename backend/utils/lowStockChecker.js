import Inventory from '../models/Inventory.js';
import sendEmail from './sendEmail.js';

// Checks all inventory items; emails admin if any are below threshold
export const checkLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$threshold'] },
    });

    if (lowStockItems.length === 0) return;

    const itemListHtml = lowStockItems
      .map((item) => `<li>${item.itemName}: ${item.quantity} ${item.unit} left (threshold: ${item.threshold})</li>`)
      .join('');

    await sendEmail({
      to: process.env.EMAIL_USER, // admin email
      subject: '⚠️ Low Stock Alert - Pizza Delivery',
      html: `<p>The following items are running low:</p><ul>${itemListHtml}</ul>`,
    });

    console.log(`Low stock email sent for ${lowStockItems.length} item(s)`);
  } catch (error) {
    console.error('Error checking low stock:', error.message);
  }
};