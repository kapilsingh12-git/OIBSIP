import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPizzaById } from '../api/pizzaApi';
import { useCart } from '../hooks/useCart';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const res = await getPizzaById(id);
        setPizza(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      pizzaId: pizza._id,
      name: pizza.name,
      price: pizza.basePrice,
      quantity,
      customization: null, // regular pizza, no customization
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (!pizza) return <p className="text-center py-10">Pizza not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={pizza.image || 'https://via.placeholder.com/500x400?text=Pizza'}
          alt={pizza.name}
          className="w-full h-80 object-cover rounded-xl"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{pizza.name}</h1>
          <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
              pizza.category === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {pizza.category}
          </span>
          <p className="text-gray-600 mt-4">{pizza.description}</p>
          <p className="text-red-600 font-bold text-2xl mt-4">₹{pizza.basePrice}</p>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 bg-gray-200 rounded-full">−</button>
            <span className="font-medium">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="w-8 h-8 bg-gray-200 rounded-full">+</button>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleAddToCart}>{added ? 'Added ✓' : 'Add to Cart'}</Button>
            <Button variant="secondary" onClick={() => navigate('/cart')}>Go to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;