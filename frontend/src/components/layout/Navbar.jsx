import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-red-600">🍕 PizzaDelivery</Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <Link to="/menu" className="hover:text-red-600">Menu</Link>
        <Link to="/build-your-pizza" className="hover:text-red-600">Build Your Pizza</Link>

        <Link to="/cart" className="relative hover:text-red-600">
          Cart
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>

        {user ? (
          <>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 flex items-center gap-1"
              >
                🛠️ Switch to Admin
              </button>
            )}
            <Link to="/orders" className="hover:text-red-600">My Orders</Link>
            <Link to="/profile" className="hover:text-red-600">Profile</Link>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-600">Login</Link>
            <Link to="/register" className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;