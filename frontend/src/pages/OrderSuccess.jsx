import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to tracking after a few seconds (UX decision made in Step 4)
    const timer = setTimeout(() => {
      navigate(`/orders/${orderId}/track`);
    }, 4000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="text-5xl mb-4">🍕✅</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Order #{orderId.slice(-6).toUpperCase()} — redirecting to tracking...
        </p>
        <Button onClick={() => navigate(`/orders/${orderId}/track`)}>Track My Order Now</Button>
      </div>
    </div>
  );
};

export default OrderSuccess;