import React from 'react';

const ContactCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default ContactCardSkeleton;
