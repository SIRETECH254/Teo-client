import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
import type { LoginPayload } from '../../../types/api.types';

const Login = () => {
  const { login, isLoading, error: contextError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const credentials: LoginPayload = {
        email: formData.email,
        password: formData.password,
      };

      const result = await login(credentials);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="flex flex-col lg:flex-row w-full gap-12 items-center">
          {/* Left side - Logo and branding */}
          <div className="flex-1 flex flex-col items-center justify-center text-center lg:text-left lg:items-start">
            <img src={logo} alt="TEO KICKS" className="h-16 mb-6" />
            <h1 className="auth-title">Sign in to your account</h1>
            <p className="auth-subtitle">Welcome back! Please enter your details.</p>
          </div>

          {/* Right side - Login form */}
          <div className="flex-1 w-full ">
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email input */}
              <div className="auth-field">
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none z-10">
                    <FiMail className="h-5 w-5 text-brand-primary" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="auth-field">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none z-10">
                    <FiLock className="h-5 w-5 text-brand-primary" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-password pl-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-toggle-icon"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="auth-actions">
                <Link to="/forgot-password" className="auth-link">
                  Forgot your password?
                </Link>
              </div>

              {/* Error alert */}
              {(error || contextError) && (
                <div className="alert alert-error">
                  {error || contextError}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={isLoading} className="auth-button">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Sign up link */}
              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
