import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { sendOtp, loginUserWithOtp } from '../../redux/features/auth';
import toast from 'react-hot-toast';

type LoginStage = 'phone' | 'otp';

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loginStage, setLoginStage] = useState<LoginStage>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate phone number (basic validation)
      if (!/^\d{10}$/.test(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      // Dispatch send OTP action and wait for the response
      const resultAction: any = await dispatch(sendOtp({ phoneNumber }));
      if (sendOtp.fulfilled.match(resultAction)) {
        // Show success toast message
        toast.success(resultAction.payload.message || 'OTP sent successfully');
        // Move to OTP stage
        setLoginStage('otp');
      } else {
        // Show error toast message
        toast.error(resultAction.payload.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate OTP (basic validation)
      if (!/^\d{6}$/.test(otp)) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
      }

      const resultAction: any = await dispatch(loginUserWithOtp({ phoneNumber, otp }));
      if (loginUserWithOtp.fulfilled.match(resultAction)) {
        toast.success('Login successful');
        navigate('/teams');
      } else {
        toast.error(resultAction.payload.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const resultAction: any = await dispatch(sendOtp({ phoneNumber }));
      if (sendOtp.fulfilled.match(resultAction)) {
        toast.success('OTP resent successfully');
      } else {
        toast.error(resultAction.payload.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred while resending OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login with Phone
          </h2>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        {loginStage === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  maxLength={10}
                  className="appearance-none rounded-none rounded-r-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginWithOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="tel"
                required
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneLogin;
