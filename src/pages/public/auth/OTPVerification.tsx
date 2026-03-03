import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import logo from '../../../assets/logo.png';

const OTPVerification = () => {
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Retrieve email from location state or localStorage on mount
  useEffect(() => {
    const emailFromState = (location.state as { email?: string })?.email;
    const emailFromStorage = localStorage.getItem('pendingEmail');

    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  // Manage resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Update individual OTP digit and auto-focus next input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace to move focus to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Resend OTP code and start countdown timer
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError(null);

    const result = await resendOTP({ email });

    if (result.success) {
      setCountdown(60); // 60 seconds countdown
    } else {
      setError(result.error || 'Failed to resend OTP');
    }

    setResendLoading(false);
  };

  // Call verifyOTP API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const otpString = otp.join('');

      const result = await verifyOTP({
        email,
        otp: otpString,
      });

      if (result.success) {
        localStorage.removeItem('pendingEmail');
        navigate('/');
      } else {
        setError(result.error || 'Verification failed');
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
            <h1 className="auth-title">Verify your email</h1>
            <p className="auth-subtitle">
              We've sent a verification code to
              <br />
              <span className="font-semibold text-brand-primary">{email}</span>
            </p>
          </div>

          {/* Right side - OTP form */}
          <div className="flex-1 w-full ">
            <form onSubmit={handleSubmit} className="auth-form">
              {/* OTP input fields */}
              <div className="auth-field">
                <label className="label">Enter the 6-digit code</label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      placeholder="0"
                    />
                  ))}
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
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>

              {/* Resend OTP button */}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="mt-2 text-sm font-medium text-brand-primary hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {resendLoading ? (
                  <div className="flex items-center">
                    <FiRefreshCw className="animate-spin mr-2" />
                    Sending...
                  </div>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <div className="flex items-center">
                    <FiRefreshCw className="mr-2" />
                    Resend code
                  </div>
                )}
              </button>

              {/* Back to login link */}
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-brand-primary flex items-center justify-center mx-auto mt-4"
                onClick={() => localStorage.removeItem('pendingEmail')}
              >
                <FiArrowLeft className="mr-2" />
                Back to login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
