import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPizzas } from '../api/pizzaApi';
import PizzaCard from '../components/pizza/PizzaCard';
import Loader from '../components/common/Loader';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getPizzas();
        setFeatured(res.data.data.slice(0, 3)); // show first 3 as "featured"
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-red-600 text-white text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Hot, Fresh Pizza Delivered Fast 🍕</h1>
        <p className="text-red-100 mb-8">Build your own pizza or pick a classic favorite.</p>
        <Link to="/menu" className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100">
          Order Now
        </Link>
      </section>

      {/* Featured Pizzas */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Pizzas</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;