import { useState, useEffect } from 'react';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../../api/inventoryApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ManageInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'base',
    quantity: '',
    unit: 'units',
    threshold: '',
  });

  const fetchInventory = async () => {
    setLoading(true);
    const res = await getInventory();
    setItems(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const resetForm = () => {
    setFormData({ itemName: '', category: 'base', quantity: '', unit: 'units', threshold: '' });
    setShowForm(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInventoryItem(formData);
      resetForm();
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Inline quantity update - directly editable in the table
  const handleQuantityUpdate = async (id, newQuantity) => {
    if (newQuantity < 0) return;
    try {
      await updateInventoryItem(id, { quantity: newQuantity });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inventory item permanently?')) return;
    await deleteInventoryItem(id);
    fetchInventory();
  };

  if (loading) return <Loader />;

  const lowStockCount = items.filter((item) => item.quantity <= item.threshold).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          {lowStockCount > 0 && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ {lowStockCount} item(s) running low on stock
            </p>
          )}
        </div>
        <Button onClick={() => setShowForm(true)}>+ Add Item</Button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name (e.g., Mozzarella Cheese)"
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="veggie">Veggie</option>
          </select>
          <input
            type="text"
            placeholder="Unit (e.g., kg, units)"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Initial Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Low-Stock Threshold"
            value={formData.threshold}
            onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <div className="col-span-2 flex gap-3">
            <Button type="submit">Add Item</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Threshold</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLow = item.quantity <= item.threshold;
              return (
                <tr key={item._id} className={`border-b ${isLow ? 'bg-red-50' : ''}`}>
                  <td className="p-3 font-medium">{item.itemName}</td>
                  <td className="p-3 capitalize">{item.category}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                        className="w-7 h-7 bg-gray-200 rounded-full"
                      >
                        −
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                        className="w-7 h-7 bg-gray-200 rounded-full"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                    </div>
                  </td>
                  <td className="p-3">{item.threshold}</td>
                  <td className="p-3">
                    {isLow ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Low Stock</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">OK</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;