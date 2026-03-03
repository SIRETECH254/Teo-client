import { useState } from 'react';
import {
  useGetUserAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../../tanstack/useAddresses';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import type { CreateAddressPayload, UpdateAddressPayload } from '../../../types/api.types';

// Address management page component
const Addresses = () => {
  const { data: addresses, isLoading } = useGetUserAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    details: '',
    coordinates: { lat: '', lng: '' },
    regions: { country: '', locality: '', sublocality: '', administrative_area_level_1: '' },
    isDefault: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle coordinates input changes
  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [name]: value,
      },
    }));
  };

  // Handle regions input changes
  const handleRegionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      regions: {
        ...prev.regions,
        [name]: value,
      },
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  // Load address data into form for editing
  const handleEdit = (addressId: string) => {
    const address = addresses?.addresses?.find((addr: any) => addr._id === addressId);
    if (address) {
      setFormData({
        name: address.name,
        address: address.address,
        details: address.details || '',
        coordinates: {
          lat: address.coordinates?.lat?.toString() || '',
          lng: address.coordinates?.lng?.toString() || '',
        },
        regions: {
          country: address.regions?.country || '',
          locality: address.regions?.locality || '',
          sublocality: address.regions?.sublocality || '',
          administrative_area_level_1: address.regions?.administrative_area_level_1 || '',
        },
        isDefault: address.isDefault || false,
      });
      setIsEditing(true);
      setEditingId(addressId);
      setShowForm(true);
    }
  };

  // Show delete confirmation
  const handleDeleteClick = (addressId: string) => {
    setDeleteConfirmId(addressId);
  };

  // Delete address after confirmation
  const handleDelete = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync(addressId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  // Set address as default
  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress.mutateAsync(addressId);
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  // Reset form and hide it
  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
      setFormData({
        name: '',
        address: '',
        details: '',
        coordinates: { lat: '', lng: '' },
        regions: { country: '', locality: '', sublocality: '', administrative_area_level_1: '' },
        isDefault: false,
      });
    };

  // Validate form data, call create or update API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && editingId) {
        const addressData: UpdateAddressPayload = {
          name: formData.name,
          address: formData.address,
          details: formData.details || undefined,
          coordinates: {
            lat: parseFloat(formData.coordinates.lat.toString()),
            lng: parseFloat(formData.coordinates.lng.toString()),
          },
          regions: {
            country: formData.regions.country,
            locality: formData.regions.locality,
            sublocality: formData.regions.sublocality || undefined,
            administrative_area_level_1: formData.regions.administrative_area_level_1 || undefined,
          },
          isDefault: formData.isDefault || false,
        };
        await updateAddress.mutateAsync({ addressId: editingId, addressData });
      } else {
        const addressData: CreateAddressPayload = {
          name: formData.name,
          address: formData.address,
          details: formData.details || undefined,
          coordinates: {
            lat: parseFloat(formData.coordinates.lat.toString()),
            lng: parseFloat(formData.coordinates.lng.toString()),
          },
          regions: {
            country: formData.regions.country,
            locality: formData.regions.locality,
            sublocality: formData.regions.sublocality || undefined,
            administrative_area_level_1: formData.regions.administrative_area_level_1 || undefined,
          },
          isDefault: formData.isDefault || false,
        };
        await createAddress.mutateAsync(addressData);
      }

      // Reset form
      handleCancel();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">My Addresses</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus className="h-4 w-4" />
            Add New Address
          </button>
        </div>

        {/* Address list */}
        {!showForm && (
          <div className="space-y-4">
            {addresses?.addresses?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <FiMapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No addresses saved yet</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Your First Address
                </button>
              </div>
            ) : (
              addresses?.addresses?.map((address: any) => (
                <div key={address._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="h-5 w-5 text-brand-primary" />
                      <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                      {address.isDefault && <span className="badge badge-soft">Default</span>}
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-600 mb-4">
                    <p>{address.address}</p>
                    {address.details && <p>{address.details}</p>}
                    <p>
                      {address.regions?.sublocality && `${address.regions.sublocality}, `}
                      {address.regions?.locality && `${address.regions.locality}, `}
                      {address.regions?.country || address.regions?.administrative_area_level_1}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(address._id)}
                      className="btn btn-secondary btn-sm flex items-center gap-2"
                    >
                      <FiEdit2 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(address._id)}
                      className="btn btn-ghost btn-sm flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Delete
                    </button>

                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="btn btn-secondary btn-sm flex items-center gap-2"
                      >
                        <FiCheck className="h-4 w-4" />
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields from documentation */}
              <div className="auth-field">
                <label htmlFor="name" className="label">Address Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Home, Office"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="address" className="label">Street Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="input"
                  placeholder="Enter street address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="details" className="label">Additional Details (Optional)</label>
                <input
                  id="details"
                  name="details"
                  type="text"
                  className="input"
                  placeholder="e.g., Apartment, Suite, Floor"
                  value={formData.details || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="auth-field">
                  <label htmlFor="lat" className="label">Latitude</label>
                  <input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    required
                    className="input"
                    placeholder="e.g., -1.2921"
                    value={formData.coordinates?.lat || ''}
                    onChange={handleCoordinatesChange}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="lng" className="label">Longitude</label>
                  <input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    required
                    className="input"
                    placeholder="e.g., 36.8219"
                    value={formData.coordinates?.lng || ''}
                    onChange={handleCoordinatesChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="country" className="label">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Kenya"
                  value={formData.regions?.country || ''}
                  onChange={handleRegionsChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="locality" className="label">City/Locality</label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Nairobi"
                  value={formData.regions?.locality || ''}
                  onChange={handleRegionsChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="sublocality" className="label">Area/Sublocality (Optional)</label>
                <input
                  id="sublocality"
                  name="sublocality"
                  type="text"
                  className="input"
                  placeholder="e.g., Westlands"
                  value={formData.regions?.sublocality || ''}
                  onChange={handleRegionsChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="administrative_area_level_1" className="label">State/County (Optional)</label>
                <input
                  id="administrative_area_level_1"
                  name="administrative_area_level_1"
                  type="text"
                  className="input"
                  placeholder="e.g., Nairobi County"
                  value={formData.regions?.administrative_area_level_1 || ''}
                  onChange={handleRegionsChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  className="auth-checkbox"
                  checked={formData.isDefault || false}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>


              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={createAddress.isPending || updateAddress.isPending}
                  className="btn btn-primary flex-1"
                >
                  {createAddress.isPending || updateAddress.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Address'
                  )}
                </button>

                <button type="button" onClick={handleCancel} className="btn btn-secondary flex-1">
                  <FiX className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Address</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="btn btn-primary flex-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
