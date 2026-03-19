import React from 'react';
import { Link } from 'react-router-dom';
import type { ContactMessage } from '../../types/api.types';

interface ContactCardProps {
  message: ContactMessage;
}

const ContactCard: React.FC<ContactCardProps> = ({ message }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-gray-100 text-gray-800';
      case 'Replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2 gap-4">
        <h3 className="font-semibold text-gray-900 truncate flex-1">
          {message.subject}
        </h3>
        <span className="text-xs text-gray-500 whitespace-nowrap pt-1">
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5em]">
        {message.message}
      </p>
      
      <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}
        >
          {message.status}
        </span>
        <Link
          to={`/my-contacts/${message._id}`}
          className="text-brand-primary hover:text-brand-primaryButton text-sm font-medium transition-colors"
          style={{ color: 'var(--color-brand-primary)' }} 
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ContactCard;
