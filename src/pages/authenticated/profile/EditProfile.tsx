import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfile, useUpdateProfile } from '../../../tanstack/useUsers';
import { FiUser, FiPhone, FiMapPin, FiClock, FiCamera, FiX, FiAlertCircle } from 'react-icons/fi';
import type { UpdateProfilePayload } from '../../../types/api.types';
import type { AxiosError } from 'axios';

// Profile edit form page component
const EditProfile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, error } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    timezone: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load profile data into form when profile is fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        timezone: profile.timezone || '',
      });
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar file selection and create preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarRemoved(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove avatar and set flag for API call
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarRemoved(true);
  };

  // Validate form data, prepare FormData if avatar uploaded, call update API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileData: UpdateProfilePayload | FormData;

      // If avatar file is selected, use FormData
      if (avatarFile) {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('phone', formData.phone);
        if (formData.country) formDataObj.append('country', formData.country);
        if (formData.timezone) formDataObj.append('timezone', formData.timezone);
        formDataObj.append('avatar', avatarFile);
        profileData = formDataObj;
      } else if (avatarRemoved) {
        // If avatar was removed, send null
        profileData = {
          name: formData.name,
          phone: formData.phone,
          avatar: null,
          country: formData.country || undefined,
          timezone: formData.timezone || undefined,
        };
      } else {
        // Regular JSON update
        profileData = {
          name: formData.name,
          phone: formData.phone,
          country: formData.country || undefined,
          timezone: formData.timezone || undefined,
        };
      }

      await updateProfile.mutateAsync(profileData);

      // Navigate back to profile
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton loader while fetching profile data
  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="">
          <div className="h-9 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {/* Avatar skeleton */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            {/* Form fields skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-6">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
            {/* Buttons skeleton */}
            <div className="flex gap-3 mt-6">
              <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
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
              {axiosError?.response?.data?.message || 'Failed to load profile'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Edit Profile</h1>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar upload section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {avatarPreview || profile?.avatar ? (
                  <img
                    src={avatarPreview || profile?.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-brand-tint border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl font-semibold text-brand-primary">
                      {formData.name?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <label htmlFor="avatar-upload" className="btn btn-secondary btn-sm cursor-pointer">
                  <FiCamera className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>

                {(avatarPreview || profile?.avatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                  >
                    <FiX className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Name input field */}
            <div className="auth-field">
              <label htmlFor="name" className="label">
                <FiUser className="inline h-4 w-4 mr-2" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone input field */}
            <div className="auth-field">
              <label htmlFor="phone" className="label">
                <FiPhone className="inline h-4 w-4 mr-2" />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Country input field */}
            <div className="auth-field">
              <label htmlFor="country" className="label">
                <FiMapPin className="inline h-4 w-4 mr-2" />
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="input"
                placeholder="Enter your country"
                value={formData.country || ''}
                onChange={handleInputChange}
              />
            </div>

            {/* Timezone input field */}
            <div className="auth-field">
              <label htmlFor="timezone" className="label">
                <FiClock className="inline h-4 w-4 mr-2" />
                Timezone
              </label>
              <input
                id="timezone"
                name="timezone"
                type="text"
                className="input"
                placeholder="e.g., Africa/Nairobi"
                value={formData.timezone || ''}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit and cancel buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={updateProfile.isPending || isSubmitting}
                className="btn btn-primary flex-1"
              >
                {updateProfile.isPending || isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
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

export default EditProfile;
