import { useState, useEffect } from 'react';
import { getPizzas, createPizza, updatePizza, deletePizza } from '../../api/pizzaApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ManagePizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Veg',
    basePrice: '',
    isCustomizable: false,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchPizzas = async () => {
    setLoading(true);
    const res = await getPizzas();
    setPizzas(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'Veg', basePrice: '', isCustomizable: false });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await updatePizza(editingId, data);
      } else {
        await createPizza(data);
      }
      resetForm();
      fetchPizzas();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pizza) => {
    setFormData({
      name: pizza.name,
      description: pizza.description || '',
      category: pizza.category,
      basePrice: pizza.basePrice,
      isCustomizable: pizza.isCustomizable,
    });
    setEditingId(pizza._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this pizza from the menu?')) return;
    await deletePizza(id);
    fetchPizzas();
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Pizzas</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Add Pizza</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
          <input
            type="text"
            placeholder="Pizza Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
          <input
            type="number"
            placeholder="Base Price"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
          />
          <div className="flex gap-3">
            <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pizzas.map((pizza) => (
              <tr key={pizza._id} className="border-b">
                <td className="p-3">{pizza.name}</td>
                <td className="p-3">{pizza.category}</td>
                <td className="p-3">₹{pizza.basePrice}</td>
                <td className="p-3 flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(pizza)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(pizza._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePizzas;