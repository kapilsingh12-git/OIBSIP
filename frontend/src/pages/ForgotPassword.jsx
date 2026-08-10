import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../api/authApi';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword(data);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          {...register('email', { required: true })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
      {message && <p className="text-sm text-gray-600 mt-4">{message}</p>}
    </div>
  );
};

export default ForgotPassword;