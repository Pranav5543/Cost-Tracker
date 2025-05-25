import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
    dispatch(clearError());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setValidationError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setValidationError('');
  };

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }

    if (!password.trim()) {
      setValidationError('Password is required');
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Password validation - minimum 6 characters
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    // Registration form validation
    if (!isLogin) {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      // Error handling is done in the slice
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(register({ email, password })).unwrap();
    } catch (error) {
      // Error handling is done in the slice
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Project Cost Tracker</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to manage your project costs</p>
      </div>
      {/* Error message display */}
      {(error || validationError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{validationError || error}</span>
        </div>
      )}
      {isLogin ? (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
              value={email}
              onChange={handleEmailChange}
              placeholder="your@email.com" 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••" 
            />
          </div>
          
          <div>
            <button 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-[#3c445c] text-center" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <button 
                className="ml-1 text-primary-500 hover:text-primary-700 font-medium" 
                onClick={toggleAuthMode}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input 
              id="reg-email" 
              name="email" 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
              value={email}
              onChange={handleEmailChange}
              placeholder="your@email.com" 
            />
          </div>
          
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              id="reg-password" 
              name="password" 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••" 
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              id="confirm-password" 
              name="confirmPassword" 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="••••••••" 
            />
          </div>
          
          <div>
            <button 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-[#3c445c]" 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account? 
              <button 
                className="ml-1 text-primary-500 hover:text-primary-700 font-medium" 
                onClick={toggleAuthMode}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
