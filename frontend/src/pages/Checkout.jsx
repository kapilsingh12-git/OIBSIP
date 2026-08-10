import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../api/orderApi';
import Button from '../components/common/Button';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (addressData) => {
    setSubmitting(true);
    setError('');

    try {
      // Map cart items into the shape backend expects
      const items = cartItems.map((item) => ({
        pizza: item.pizzaId,
        name: item.name,
        customization: item.customization,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await createOrder({
        items,
        deliveryAddress: addressData,
      });

      const orderId = res.data.data._id;
      clearCart();
      navigate(`/payment/${orderId}`); // will be built in Step 12
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Your cart is empty. Add some pizzas first!</p>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Order Summary</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{getCartTotal()}</span>
        </div>
      </div>

      {/* Delivery Address Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="font-semibold text-gray-700">Delivery Address</h2>

        <div>
          <input
            type="text"
            placeholder="Street Address"
            {...register('street', { required: 'Street address is required' })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="City"
            {...register('city', { required: 'City is required' })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Pincode"
            {...register('pincode', {
              required: 'Pincode is required',
              pattern: { value: /^[0-9]{6}$/, message: 'Enter a valid 6-digit pincode' },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order & Proceed to Payment'}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;