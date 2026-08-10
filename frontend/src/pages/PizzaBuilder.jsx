import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPizzaOptions } from '../api/pizzaApi';
import { useCart } from '../hooks/useCart';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const steps = [
  { key: 'base', label: 'Choose Your Base' },
  { key: 'sauce', label: 'Choose Your Sauce' },
  { key: 'cheese', label: 'Choose Your Cheese' },
  { key: 'veggie', label: 'Choose Your Veggies (Multiple)' },
];

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggie: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await getPizzaOptions();
        setOptions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const currentType = steps[currentStep].key;
  const currentOptions = options[currentType] || [];

  const handleSingleSelect = (option) => {
    setSelection((prev) => ({ ...prev, [currentType]: option }));
  };

  const handleVeggieToggle = (option) => {
    setSelection((prev) => {
      const exists = prev.veggie.find((v) => v._id === option._id);
      const updated = exists
        ? prev.veggie.filter((v) => v._id !== option._id)
        : [...prev.veggie, option];
      return { ...prev, veggie: updated };
    });
  };

  const isStepComplete = () => {
    if (currentType === 'veggie') return true; // veggies optional
    return selection[currentType] !== null;
  };

  const calculateTotal = () => {
    const basePrice = 150; // base price for a custom pizza
    let total = basePrice;
    if (selection.base) total += selection.base.extraPrice;
    if (selection.sauce) total += selection.sauce.extraPrice;
    if (selection.cheese) total += selection.cheese.extraPrice;
    selection.veggie.forEach((v) => (total += v.extraPrice));
    return total;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleAddToCart = () => {
    addToCart({
      pizzaId: 'custom', // no real Pizza document backing this
      name: 'Custom Built Pizza',
      price: calculateTotal(),
      quantity: 1,
      customization: {
        base: selection.base?.name,
        sauce: selection.sauce?.name,
        cheese: selection.cheese?.name,
        veggies: selection.veggie.map((v) => v.name),
      },
    });
    navigate('/cart');
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Build Your Own Pizza 🍕</h1>
      <p className="text-gray-500 mb-6">Step {currentStep + 1} of {steps.length}</p>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`flex-1 h-2 rounded-full ${
              index <= currentStep ? 'bg-red-600' : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">{steps[currentStep].label}</h2>

      {/* Options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {currentOptions.length === 0 && (
          <p className="text-gray-400 col-span-full">No options available for this category yet.</p>
        )}

        {currentOptions.map((option) => {
          const isSelected =
            currentType === 'veggie'
              ? selection.veggie.some((v) => v._id === option._id)
              : selection[currentType]?._id === option._id;

          return (
            <button
              key={option._id}
              onClick={() =>
                currentType === 'veggie' ? handleVeggieToggle(option) : handleSingleSelect(option)
              }
              className={`border-2 rounded-xl p-4 text-left transition-colors ${
                isSelected ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-800">{option.name}</p>
              {option.extraPrice > 0 && (
                <p className="text-xs text-gray-500 mt-1">+₹{option.extraPrice}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
          Back
        </Button>

        <span className="font-bold text-red-600 text-lg">Total: ₹{calculateTotal()}</span>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={!isStepComplete()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleAddToCart} disabled={!selection.base || !selection.sauce || !selection.cheese}>
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default PizzaBuilder;