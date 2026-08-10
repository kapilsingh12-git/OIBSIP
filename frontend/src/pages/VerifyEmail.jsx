import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // guard against double-call

  useEffect(() => {
    if (hasVerified.current) return; // skip if already called once
    hasVerified.current = true;

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-xl shadow p-8">
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-700">{message}</p>
            <Link to="/login" className="text-red-600 underline mt-4 inline-block">Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;