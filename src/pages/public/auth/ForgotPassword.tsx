import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import logo from '../../../assets/logo.png';

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to send reset email');
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
            {isSubmitted ? (
              <>
                <h1 className="auth-title">Check your email</h1>
                <p className="auth-subtitle">
                  We've sent password reset instructions to
                  <br />
                  <span className="font-semibold text-brand-primary">{email}</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="auth-title">Forgot your password?</h1>
                <p className="auth-subtitle">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </>
            )}
          </div>

          {/* Right side - Form or success message */}
          <div className="flex-1 w-full ">
            {isSubmitted ? (
              <div className="auth-form">
                {/* Success message */}
                <div className="auth-inline-message-success mb-6">
                  <div className="flex items-center">
                    <FiCheck className="h-5 w-5 mr-2" />
                    <p className="text-sm font-medium">Check your email</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  If you don't see the email, check your spam folder.
                </p>

                {/* Back to login button */}
                <Link to="/login" className="auth-button inline-flex items-center justify-center">
                  <FiArrowLeft className="mr-2" />
                  Back to login
                </Link>

                {/* Try again button */}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-brand-primary hover:text-brand-accent transition-colors mt-4 w-full"
                >
                  Try again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Email field */}
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
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Error alert */}
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button type="submit" disabled={isLoading} className="auth-button">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send reset instructions'
                  )}
                </button>

                {/* Back to login link */}
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-brand-primary flex items-center justify-center mx-auto mt-4"
                >
                  <FiArrowLeft className="mr-2" />
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

export default ForgotPassword;
