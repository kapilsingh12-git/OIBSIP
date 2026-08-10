import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/pizzas', label: 'Manage Pizzas', icon: '🍕' },
  { path: '/admin/orders', label: 'Manage Orders', icon: '📦' },
  { path: '/admin/inventory', label: 'Inventory', icon: '📋' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-lg font-bold">🍕 Admin Panel</h2>
        </div>

        {/* Switch back to normal website */}
        <button
          onClick={() => navigate('/')}
          className="mx-3 mt-3 mb-1 text-left text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg flex items-center gap-2"
        >
          ⬅️ Back to Website
        </button>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-300 hover:text-white px-3 py-2"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <span className="text-gray-600 text-sm">Welcome back,</span>
          <span className="font-semibold text-gray-800">{user?.name}</span>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;