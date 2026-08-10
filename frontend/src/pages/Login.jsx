import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await loginUser(formData);
      const { user, token } = res.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <Link to="/forgot-password" className="text-sm text-red-600 block text-right">Forgot Password?</Link>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</Button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Don't have an account? <Link to="/register" className="text-red-600">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;