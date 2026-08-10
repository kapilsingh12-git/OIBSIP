import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              {item.customization && (
                <p className="text-xs text-gray-500 mt-1">
                  {item.customization.base && `Base: ${item.customization.base}`}
                  {item.customization.sauce && `, Sauce: ${item.customization.sauce}`}
                  {item.customization.cheese && `, Cheese: ${item.customization.cheese}`}
                </p>
              )}
              <p className="text-red-600 font-bold mt-1">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="w-7 h-7 bg-gray-200 rounded-full"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="w-7 h-7 bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(index)} className="text-red-500 text-sm hover:underline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Total: ₹{getCartTotal()}</span>
        <Button onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
      </div>
    </div>
  );
};

export default Cart;