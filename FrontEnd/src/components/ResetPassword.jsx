import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post('https://guzostudy.onrender.com/api/auth/reset-password', {
        email,
        otp,
        newPassword: password
      });

      setMessage('Password reset successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p>Enter the OTP sent to {email} and your new password</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />

            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <button className="w-full py-2 bg-blue-600 text-white rounded-md">Reset Password</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
