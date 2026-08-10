import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../api/authApi';
import Button from '../components/common/Button';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          {...register('password', { required: true, minLength: 8 })}
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.password && <p className="text-red-500 text-xs">Password must be at least 8 characters</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;