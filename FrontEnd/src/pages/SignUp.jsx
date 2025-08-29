import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://guzostudy.onrender.com/api/auth/register',
        formData
      );

      const { user } = response.data;
      localStorage.setItem('tempUser', JSON.stringify(user));

      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>

          {/* Google Signup */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <img 
                src="https://www.svgrepo.com/show/355037/google.svg" 
                alt="Google" 
                className="w-5 h-5 mr-2" 
              />
              Sign up with Google
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Sending OTP...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SignUp;
