import { Link } from 'react-router-dom';

const PizzaCard = ({ pizza }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={pizza.image || 'https://via.placeholder.com/300x200?text=Pizza'}
        alt={pizza.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{pizza.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              pizza.category === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {pizza.category}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{pizza.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-red-600 font-bold text-lg">₹{pizza.basePrice}</span>
          <Link
            to={`/pizza/${pizza._id}`}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;