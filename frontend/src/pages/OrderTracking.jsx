import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import socket from '../utils/socket';
import Loader from '../components/common/Loader';

const statusSteps = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Join the room specific to this order
    socket.emit('joinOrderRoom', orderId);

    // Listen for real-time status updates
    const handleUpdate = (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) => ({ ...prev, status: data.status }));
      }
    };
    socket.on('orderStatusUpdate', handleUpdate);

    // Cleanup: remove listener when component unmounts
    return () => {
      socket.off('orderStatusUpdate', handleUpdate);
    };
  }, [orderId]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-10">Order not found.</p>;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Your Order</h1>
      <p className="text-gray-500 mb-8">Order #{orderId.slice(-6).toUpperCase()}</p>

      {order.status === 'Cancelled' ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">This order has been cancelled.</div>
      ) : (
        <div className="flex justify-between relative">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex-1 flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index <= currentStepIndex ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                {index <= currentStepIndex ? '✓' : index + 1}
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">{step}</p>
            </div>
          ))}
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-0">
            <div
              className="h-1 bg-red-600 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;