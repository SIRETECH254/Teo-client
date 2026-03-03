# Addresses Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Sketch Wireframe](#sketch-wireframe)
- [Address List Display](#address-list-display)
- [Add/Edit Address Form](#addedit-address-form)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetUserAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../../tanstack/useAddresses';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import type { CreateAddressPayload, UpdateAddressPayload } from '../../../types/api.types';
```

## Context and State Management
- **TanStack Query hooks:** 
  - `useGetUserAddresses()` - Fetches all user addresses.
  - `useCreateAddress()` - Creates new address.
  - `useUpdateAddress()` - Updates existing address.
  - `useDeleteAddress()` - Deletes address.
  - `useSetDefaultAddress()` - Sets default address.
- **Query key:** `['addresses']` for address list cache.
- **Hook usage:** `const { data: addresses, isLoading } = useGetUserAddresses();`
- **Form state:** `formData` object managed with `useState` for create/edit form.
- **Additional state:** `isEditing`, `editingId`, `showForm`, `deleteConfirmId`.

**`useGetUserAddresses` hook (from `tanstack/useAddresses.ts`):**
```typescript
export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await addressAPI.getUserAddresses();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
```

## UI Structure
- **Screen shell:** Two-section layout with address list and add/edit form.
- **Address list:** Cards displaying each address with default badge, edit, and delete actions.
- **Add button:** Floating action button or header button to show add form.
- **Form modal/section:** Form for creating or editing addresses with all required fields.
- **Default indicator:** Badge showing which address is set as default.
- **Actions:** Edit, delete, and set default buttons for each address.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Addresses Page                             │
│  ┌───────────────────────────────────────┐ │
│  │  Header: "My Addresses" [+ Add New]  │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Address Card 1 (Default)            │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │ Name: Home                      │ │ │
│  │  │ Address: 123 Main St...         │ │ │
│  │  │ Details: Apt 4B                 │ │ │
│  │  │ Country: Kenya                  │ │ │
│  │  │ [Edit] [Delete] [Default ✓]    │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Address Card 2                      │ │
│  │  [Similar structure]                │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Add/Edit Form (when shown)         │ │
│  │  [Form fields]                      │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  📍 My Addresses                    [+ Add New Address]     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🏠 Home                                    [Default]│   │
│  │  123 Main Street, Westlands, Nairobi                │   │
│  │  Apartment 4B                                       │   │
│  │  Kenya, Nairobi County                              │   │
│  │  [✏️ Edit]  [🗑️ Delete]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🏢 Office                                            │   │
│  │  456 Business Park, Kilimani                         │   │
│  │  Suite 201                                           │   │
│  │  Kenya, Nairobi County                               │   │
│  │  [✏️ Edit]  [🗑️ Delete]  [Set as Default]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Add/Edit Address Form                              │   │
│  │  Name: [________________]                           │   │
│  │  Address: [________________]                       │   │
│  │  Details: [________________]                       │   │
│  │  Coordinates: [Lat: ___] [Lng: ___]               │   │
│  │  Country: [________________]                       │   │
│  │  Locality: [________________]                       │   │
│  │  [✓ Set as default]                                │   │
│  │  [Save] [Cancel]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Address List Display

- **Address Card**
  ```typescript
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <FiMapPin className="h-5 w-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
        {address.isDefault && (
          <span className="badge badge-soft">Default</span>
        )}
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
  ```

- **Empty State**
  ```typescript
  {!isLoading && addresses?.addresses?.length === 0 && (
    <div className="text-center py-12">
      <FiMapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">No addresses saved yet</p>
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary"
      >
        <FiPlus className="h-4 w-4 mr-2" />
        Add Your First Address
      </button>
    </div>
  )}
  ```

## Add/Edit Address Form

- **Form Fields**
  ```typescript
  <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <button
        type="button"
        onClick={handleCancel}
        className="btn btn-secondary flex-1"
      >
        <FiX className="h-4 w-4 mr-2" />
        Cancel
      </button>
    </div>
  </form>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `addressAPI` methods.
- **Get addresses endpoint:** `GET /api/addresses`.
- **Create address endpoint:** `POST /api/addresses`.
- **Update address endpoint:** `PUT /api/addresses/:addressId`.
- **Delete address endpoint:** `DELETE /api/addresses/:addressId`.
- **Set default endpoint:** `PUT /api/addresses/:addressId/default`.
- **Auth Required:** Yes (JWT token in Authorization header).
- **TanStack Query:** Uses hooks for data fetching, mutations, and cache invalidation.
- **Response contract:** `response.data.data` contains address or addresses array.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate` for navigation.
- TanStack Query: Address management hooks from `useAddresses.ts`.
- `react-icons/fi` for icons (FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX).
- Tailwind CSS classes for styling with custom classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input`, `.label`, `.badge`, `.badge-soft`).
- HTML elements: `div`, `form`, `input`, `button`, `label`, `p`, `span`.

## Error Handling
- **Loading state:** Shows spinner while fetching addresses.
- **Error state:** Displays error message in alert banner if API call fails.
- **Delete confirmation:** Confirmation dialog before deleting address.
- **Network errors:** Handled by TanStack Query with automatic retry (1 attempt).
- **401 Unauthorized:** Automatically handled by API interceptor (token refresh).
- **Mutation errors:** Displayed in form or alert banner.

## Navigation Flow
- **Route:** `/profile/addresses`.
- **Entry points:**
  - From profile page via "Manage Addresses" button.
  - From navigation menu/sidebar.
  - Direct URL access (requires authentication).
- **Navigation:**
  - Back to profile page via cancel or back button.
  - Form can be shown/hidden without navigation.
- **Authentication:** Page should be protected route (requires login).

## Functions Involved

- **`handleSubmit`** — Calls create or update API.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const addressData: CreateAddressPayload | UpdateAddressPayload = {
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

      if (isEditing && editingId) {
        await updateAddress.mutateAsync({ addressId: editingId, addressData });
      } else {
        await createAddress.mutateAsync(addressData);
      }

      // Reset form
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
    } catch (error: any) {
      console.error('Failed to save address:', error);
    }
  };
  ```

- **`handleEdit`** — Loads address data into form for editing.
  ```typescript
  const handleEdit = (addressId: string) => {
    const address = addresses?.addresses?.find((addr: any) => addr._id === addressId);
    if (address) {
      setFormData({
        name: address.name,
        address: address.address,
        details: address.details || '',
        coordinates: {
          lat: address.coordinates?.lat || '',
          lng: address.coordinates?.lng || '',
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
  ```

- **`handleDeleteClick`** — Shows delete confirmation.
  ```typescript
  const handleDeleteClick = (addressId: string) => {
    setDeleteConfirmId(addressId);
  };
  ```

- **`handleDelete`** — Deletes address after confirmation.
  ```typescript
  const handleDelete = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync(addressId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };
  ```

- **`handleSetDefault`** — Sets address as default.
  ```typescript
  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress.mutateAsync(addressId);
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };
  ```

- **`handleCancel`** — Resets form and hides it.
  ```typescript
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
  ```

- **`handleInputChange`** — Updates form data state.
  ```typescript
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  ```

## Future Enhancements
- Add Google Maps integration for address selection.
- Add address autocomplete using Google Places API.
- Add address validation before saving.
- Add bulk address import/export functionality.
- Add address search and filtering.
- Add address sorting options (default first, alphabetical, recently added).
- Add address usage statistics (most used for orders).
- Add address sharing functionality.
- Add address templates for quick creation.
- Add address verification via postal service API.
