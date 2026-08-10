import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import { createRazorpayOrder, verifyPayment } from '../api/paymentApi';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.data);
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Step 1: Ask our backend to create a Razorpay order
      const { data } = await createRazorpayOrder(orderId);

      // Step 2: Configure Razorpay checkout options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Pizza Delivery',
        description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          // Step 3: This runs after user completes payment in the Razorpay popup
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            navigate(`/order-success/${orderId}`);
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#dc2626',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !order) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
        <p className="text-gray-500 text-sm mb-6">Order #{orderId.slice(-6).toUpperCase()}</p>

        <p className="text-3xl font-bold text-red-600 mb-6">₹{order.totalAmount}</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <Button onClick={handlePayment} disabled={processing}>
          {processing ? 'Processing...' : 'Pay Now'}
        </Button>

        <p className="text-xs text-gray-400 mt-4">
          Test mode: use card 4111 1111 1111 1111, any future expiry, any CVV
        </p>
      </div>
    </div>
  );
};

export default Payment;