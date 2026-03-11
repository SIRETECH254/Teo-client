import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../../tanstack/useUsers';
import { FiBell, FiMail, FiPhone, FiSmartphone, FiPackage, FiTag, FiAlertCircle } from 'react-icons/fi';
import type { UpdateNotificationPreferencesPayload } from '../../../types/api.types';
import type { AxiosError } from 'axios';

// Notification preferences page component
const NotificationPreferences = () => {
  const navigate = useNavigate();
  const { data: preferencesData, isLoading, isError, error } = useGetNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [preferences, setPreferences] = useState({
    email: false,
    sms: false,
    inApp: false,
    orderUpdates: false,
    promotions: false,
    stockAlerts: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load preferences into state when fetched
  useEffect(() => {
    if (preferencesData) {
      setPreferences({
        email: preferencesData.email || false,
        sms: preferencesData.sms || false,
        inApp: preferencesData.inApp || false,
        orderUpdates: preferencesData.orderUpdates || false,
        promotions: preferencesData.promotions || false,
        stockAlerts: preferencesData.stockAlerts || false,
      });
    }
  }, [preferencesData]);

  // Update preference state and auto-save on toggle change
  const handleToggleChange = async (key: string, value: boolean) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };

    setPreferences(updatedPreferences);

    // Auto-save on toggle change
    try {
      await updatePreferences.mutateAsync(updatedPreferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      // Revert on error
      setPreferences(preferences);
      console.error('Failed to update preference:', error);
    }
  };

  // Save all preferences to API
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const preferencesData: UpdateNotificationPreferencesPayload = {
        email: preferences.email || false,
        sms: preferences.sms || false,
        inApp: preferences.inApp || false,
        orderUpdates: preferences.orderUpdates || false,
        promotions: preferences.promotions || false,
        stockAlerts: preferences.stockAlerts || false,
      };

      await updatePreferences.mutateAsync(preferencesData);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show skeleton loader while fetching preferences
  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="">
          <div className="h-9 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          {/* Preference sections skeleton */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Buttons skeleton */}
          <div className="flex gap-3 mt-6">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show centered error state if API call fails
  if (isError) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return (
      <div className="page-container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FiAlertCircle className="h-24 w-24 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">
              {axiosError?.response?.data?.message || 'Failed to load notification preferences'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Notification Preferences</h1>

        {/* Success message */}
        {saveSuccess && (
          <div className="alert alert-success mb-6">
            <p>Preferences saved successfully!</p>
          </div>
        )}

        {/* General notifications section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiBell className="h-5 w-5 text-brand-primary" />
            General Notifications
          </h2>

          <div className="space-y-4">
            {/* Email notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiMail className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Email notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.email || false}
                  onChange={(e) => handleToggleChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>

            {/* SMS notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">SMS notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.sms || false}
                  onChange={(e) => handleToggleChange('sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>

            {/* In-app notifications */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FiSmartphone className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">In-app notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications in the app</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.inApp || false}
                  onChange={(e) => handleToggleChange('inApp', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Order updates section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiPackage className="h-5 w-5 text-brand-primary" />
            Order Updates
          </h2>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <FiPackage className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="font-medium text-gray-900">Order status updates</p>
                <p className="text-sm text-gray-500">Get notified about order status changes</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences?.orderUpdates || false}
                onChange={(e) => handleToggleChange('orderUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>
        </div>

        {/* Marketing section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiTag className="h-5 w-5 text-brand-primary" />
            Marketing
          </h2>

          <div className="space-y-4">
            {/* Promotions */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiTag className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Promotions and offers</p>
                  <p className="text-sm text-gray-500">Receive promotional offers and discounts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.promotions || false}
                  onChange={(e) => handleToggleChange('promotions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>

            {/* Stock alerts */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Stock alerts</p>
                  <p className="text-sm text-gray-500">Get notified when items are back in stock</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.stockAlerts || false}
                  onChange={(e) => handleToggleChange('stockAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save and cancel buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={updatePreferences.isPending || isSaving}
            className="btn btn-primary flex-1"
          >
            {updatePreferences.isPending || isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Preferences'
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
      </div>
    </div>
  );
};

export default NotificationPreferences;
