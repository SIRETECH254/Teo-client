import React from 'react';

const ContactDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="w-2/3">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 mt-4">
         <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
         <div className="space-y-3 pl-4 border-l-2 border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
         </div>
      </div>
    </div>
  );
};

export default ContactDetailSkeleton;
