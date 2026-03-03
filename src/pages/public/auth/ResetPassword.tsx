import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import logo from '../../../assets/logo.png';

const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      if (!token) {
        setError('Invalid reset token');
        return;
      }

      const result = await resetPassword(token, formData.newPassword);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password');
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
            {isSuccess ? (
              <>
                <h1 className="auth-title">Password reset successful!</h1>
                <p className="auth-subtitle">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </>
            ) : (
              <>
                <h1 className="auth-title">Reset your password</h1>
                <p className="auth-subtitle">Enter your new password below.</p>
              </>
            )}
          </div>

          {/* Right side - Form or success message */}
          <div className="flex-1 w-full ">
            {isSuccess ? (
              <div className="auth-form">
                {/* Success message */}
                <div className="auth-inline-message-success mb-6">
                  <div className="flex items-center">
                    <FiCheck className="h-5 w-5 mr-2" />
                    <p className="text-sm font-medium">Password reset successful!</p>
                  </div>
                </div>

                {/* Go to login button */}
                <Link to="/login" className="auth-button inline-flex items-center justify-center">
                  Go to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {/* New password field */}
                <div className="auth-field">
                  <label htmlFor="newPassword" className="label">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-brand-primary" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input-password pl-10"
                      placeholder="Enter new password"
                      value={formData.newPassword}
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

                {/* Confirm password field */}
                <div className="auth-field">
                  <label htmlFor="confirmPassword" className="label">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-brand-primary" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="input-password pl-10"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="input-toggle-icon"
                      >
                        {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error alert */}
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-button"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                {/* Back to login link */}
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-primary mt-4">
                  Back to login
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
