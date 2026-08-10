import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-300 text-center py-4 text-sm">
        © 2025 Pizza Delivery. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;