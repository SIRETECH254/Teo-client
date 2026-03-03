import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '../../../tanstack/useUsers';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import type { ChangePasswordPayload } from '../../../types/api.types';

// Password change form page component
const ChangePassword = () => {
  const navigate = useNavigate();
  const changePassword = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data, call change password API, handle navigation on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const passwordData: ChangePasswordPayload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await changePassword.mutateAsync(passwordData);

      // Show success message and navigate back
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container py-8">
      <div className="">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Change Password</h1>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current password field */}
            <div className="auth-field">
              <label htmlFor="currentPassword" className="label">
                <FiLock className="inline h-4 w-4 mr-2" />
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-5 w-5 text-brand-primary" />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  className="input-password pl-10"
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="input-toggle-icon"
                  >
                    {showCurrentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* New password field */}
            <div className="auth-field">
              <label htmlFor="newPassword" className="label">
                <FiLock className="inline h-4 w-4 mr-2" />
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-5 w-5 text-brand-primary" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  className="input-password pl-10"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="input-toggle-icon"
                  >
                    {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* Password requirements */}
              {formData.newPassword && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="mb-2">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={formData.newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                      At least 6 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
                      One lowercase letter
                    </li>
                    <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm password field */}
            <div className="auth-field">
              <label htmlFor="confirmPassword" className="label">
                <FiLock className="inline h-4 w-4 mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-5 w-5 text-brand-primary" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input-password pl-10"
                  placeholder="Confirm your new password"
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
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 text-xs">
                  {formData.newPassword === formData.confirmPassword ? (
                    <p className="text-green-600 flex items-center gap-1">
                      <FiCheck className="h-4 w-4" />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-red-600 flex items-center gap-1">
                      <FiX className="h-4 w-4" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit and cancel buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={changePassword.isPending || isSubmitting}
                className="btn btn-primary flex-1"
              >
                {changePassword.isPending || isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
