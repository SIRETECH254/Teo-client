import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContactMessage } from '../../../tanstack/useContact';
import ContactDetailSkeleton from '../../../components/contact/ContactDetailSkeleton';
import { MdArrowBack, MdErrorOutline } from 'react-icons/md';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: message, isLoading, isError, error } = useContactMessage(id || '');

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
         <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
         </div>
        <ContactDetailSkeleton />
      </div>
    );
  }

  if (isError || !message) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <MdErrorOutline className="text-6xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Message not found
        </h3>
        <p className="text-gray-500 mb-6">
          {(error as any)?.response?.data?.message ||
            'The message you are looking for does not exist or an error occurred.'}
        </p>
        <Link
          to="/my-contacts"
          className="text-brand-primary hover:underline"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Return to My Messages
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/my-contacts"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <MdArrowBack className="mr-2" />
        Back to Messages
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {message.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <span>ID: {message._id}</span>
                <span className="hidden md:inline">•</span>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium self-start ${getStatusColor(
                message.status
              )}`}
            >
              {message.status}
            </span>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Your Message
          </h2>
          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </div>
        </div>

        {/* Replies Section (if any) */}
        {message.replies && message.replies.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Replies
            </h2>
            <div className="space-y-6">
              {message.replies.map((reply: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs" style={{ backgroundColor: 'var(--color-brand-soft)', color: 'var(--color-brand-primary)' }}>
                    A
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Support Team</span>
                        <span className="text-xs text-gray-500">{new Date(reply.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{reply.message || reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
