import { useState } from 'react';
import { useGetProductReviews } from '../../tanstack/useReviews';
import { useAuth } from '../../contexts/AuthContext';
import { FiMessageSquare, FiStar } from 'react-icons/fi';
import Pagination from '../../components/ui/Pagination';

// Reviews section component for displaying product reviews
interface ReviewsSectionProps {
  productId: string;
  className?: string;
}

const ReviewsSection = ({ productId, className = '' }: ReviewsSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useGetProductReviews(productId, { page: currentPage, limit: 5 });

  // Extract reviews, pagination, and stats from response
  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination;
  const stats = reviewsData?.stats;

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Failed to load reviews. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-3 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <FiMessageSquare className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Customer Reviews
          </h2>
          {stats && (
            <span className="text-sm text-gray-500">({stats.totalReviews} reviews)</span>
          )}
        </div>
      </div>

      {/* Review Stats */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageRating?.toFixed(1) || '0.0'}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(stats.averageRating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">Average Rating</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Rating Distribution
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    stats.ratingDistribution?.find((d: any) => d._id === rating)?.count || 0;
                  const percentage =
                    stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-4">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">
                    {review.user?.name || 'Anonymous'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (review.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-400 mt-2">
              Please log in to write a review.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={pagination.totalDocs}
          pageSize={5} // As set in the useGetProductReviews call
          currentPageCount={reviews.length}
        />
      )}
    </div>
  );
};

export default ReviewsSection;
