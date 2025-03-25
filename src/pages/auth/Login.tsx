// src/components/auth/Login.tsx
import  { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/features/auth';
import { LoginData } from '../../types/auth';
import PhoneLogin from './PhoneLogin';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email' as 'email' | 'phone');
  const [emailFormData, setEmailFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(loginUser(emailFormData));
      navigate('/settings');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loginMethod === 'phone') {
    return <PhoneLogin />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className="mt-2 text-center">
            <button
              onClick={() => setLoginMethod('email')}
              className={`mr-4 px-4 py-2 rounded ${
                loginMethod === 'email' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`px-4 py-2 rounded ${
                loginMethod === 'phone' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Phone Login
            </button>
          </div>
        </div>

        {error && (
          <div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" 
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={emailFormData.email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={emailFormData.password}
                onChange={handleEmailChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a 
                href="/forgot-password" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;