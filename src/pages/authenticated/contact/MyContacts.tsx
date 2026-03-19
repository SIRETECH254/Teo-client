import React from 'react';
import { useMyMessages } from '../../../tanstack/useContact';
import ContactCard from '../../../components/contact/ContactCard';
import ContactCardSkeleton from '../../../components/contact/ContactCardSkeleton';
import { MdErrorOutline } from 'react-icons/md';
import { type ContactMessage } from '../../../types/api.types';

const MyContacts: React.FC = () => {
  const { data, isLoading, isError, error } = useMyMessages({
    page: 1,
    limit: 10, // Adjust as needed or add pagination controls later
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">My Messages</h1>
      
      {isLoading ? (
        // Show 5 skeletons while loading
        Array.from({ length: 5 }).map((_, index) => (
          <ContactCardSkeleton key={index} />
        ))
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MdErrorOutline className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Oops! Something went wrong.
          </h3>
          <p className="text-gray-500 max-w-md">
            {(error as any)?.response?.data?.message ||
              'We couldn\'t load your messages. Please try again later.'}
          </p>
        </div>
      ) : data?.messages?.length === 0 ? (
         <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-500">You haven't sent any messages yet.</p>
         </div>
      ) : (
        <div className="space-y-4">
          {data?.messages.map((message: ContactMessage) => (
            <ContactCard key={message._id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContacts;
