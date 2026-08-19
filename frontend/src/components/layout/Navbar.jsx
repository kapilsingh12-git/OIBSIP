import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-red-600" onClick={closeMenu}>
          🍕 PizzaDelivery
        </Link>

        {/* Hamburger button - only visible on mobile */}
        <button
          className="sm:hidden text-2xl text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop links - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/menu" className="hover:text-red-600">Menu</Link>
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
                <button onClick={() => navigate('/admin/dashboard')} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700">
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
      </div>

      {/* Mobile dropdown menu - only shows when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 pb-2 text-sm font-medium text-gray-700">
          <Link to="/menu" onClick={closeMenu} className="hover:text-red-600">Menu</Link>
          <Link to="/cart" onClick={closeMenu} className="hover:text-red-600">
            Cart {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <button onClick={() => { navigate('/admin/dashboard'); closeMenu(); }} className="text-left bg-purple-600 text-white px-3 py-1.5 rounded-lg">
                  🛠️ Switch to Admin
                </button>
              )}
              <Link to="/orders" onClick={closeMenu} className="hover:text-red-600">My Orders</Link>
              <Link to="/profile" onClick={closeMenu} className="hover:text-red-600">Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="hover:text-red-600">Login</Link>
              <Link to="/register" onClick={closeMenu} className="hover:text-red-600">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;