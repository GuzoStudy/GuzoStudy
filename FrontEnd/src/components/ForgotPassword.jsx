import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post('https://guzostudy.onrender.com/api/auth/forgot-password', { email });
      setMessage('OTP sent! Check your email.');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />

            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <button className="w-full py-2 bg-blue-600 text-white rounded-md">Send OTP</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
