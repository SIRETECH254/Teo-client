import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '../../../tanstack/useUsers';
import { FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiEdit2, FiLock, FiMap, FiBell } from 'react-icons/fi';
import type { AxiosError } from 'axios';

// Main profile display page component
const Profile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, error } = useGetProfile();

  // Show loading spinner while fetching profile data
  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if API call fails
  if (isError) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return (
      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <p>{axiosError?.response?.data?.message || 'Failed to load profile'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Profile</h1>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Avatar display section */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-brand-tint border-4 border-white shadow-lg">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-brand-primary">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>

          {/* Profile information section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiUser className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiMail className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'N/A'}</p>
              </div>
            </div>

            {profile?.country && (
              <div className="flex items-center gap-3">
                <FiMapPin className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.country}</p>
                </div>
              </div>
            )}

            {profile?.timezone && (
              <div className="flex items-center gap-3">
                <FiClock className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="text-sm text-gray-500">Timezone</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.timezone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons section */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => navigate('/profile/edit')}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <FiEdit2 className="h-4 w-4" />
              Edit Profile
            </button>

            <button
              onClick={() => navigate('/profile/change-password')}
              className="btn btn-secondary flex items-center justify-center gap-2"
            >
              <FiLock className="h-4 w-4" />
              Change Password
            </button>
          </div>

          <button
            onClick={() => navigate('/profile/addresses')}
            className="btn btn-secondary w-full flex items-center justify-center gap-2 mt-3"
          >
            <FiMap className="h-4 w-4" />
            Manage Addresses
          </button>

          <button
            onClick={() => navigate('/profile/notifications')}
            className="btn btn-secondary w-full flex items-center justify-center gap-2 mt-3"
          >
            <FiBell className="h-4 w-4" />
            Notification Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
