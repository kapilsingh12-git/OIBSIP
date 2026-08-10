import { useState, useEffect } from 'react';
import { getPizzas } from '../api/pizzaApi';
import PizzaCard from '../components/pizza/PizzaCard';
import Loader from '../components/common/Loader';

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getPizzas(category);
        setPizzas(res.data.data);
      } catch (err) {
        setError('Failed to load pizzas. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h1>

      {/* Category Filter */}
      <div className="flex gap-3 mb-6">
        {['', 'Veg', 'Non-Veg'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === cat ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat === '' ? 'All' : cat}
          </button>
        ))}
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No pizzas found.</p>
          ) : (
            pizzas.map((pizza) => <PizzaCard key={pizza._id} pizza={pizza} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;