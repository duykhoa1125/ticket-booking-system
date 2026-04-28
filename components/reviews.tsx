"use client";

import { useState } from "react";
import { ReviewList } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { MessageSquarePlus } from "lucide-react";
import type { MovieReview } from "@/services/types";

interface ReviewsProps {
  movie_id: string;
  movieTitle: string;
  initialReviews: MovieReview[];
}

/**
 * Client Component wrapper để quản lý state của reviews
 * Sử dụng initialReviews từ server, cho phép optimistic updates
 */
export function Reviews({
  movie_id,
  movieTitle,
  initialReviews,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<MovieReview[]>(initialReviews);

  const handleReviewSubmit = (newReview: MovieReview) => {
    // Check if user already has a review for this movie
    const existingReviewIndex = reviews.findIndex(
      (r) => r.phone_number === newReview.phone_number
    );

    if (existingReviewIndex !== -1) {
      // Update existing review - replace it and move to top
      const updatedReviews = reviews.filter(
        (r) => r.phone_number !== newReview.phone_number
      );
      setReviews([newReview, ...updatedReviews]);
    } else {
      // Add new review to the top
      setReviews([newReview, ...reviews]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquarePlus className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Đánh giá từ khán giả
        </h2>
      </div>

      {/* Side-by-side layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Write Review Form - Left Side (Sticky) */}
        <div className="lg:col-span-1">
          <ReviewForm movie_id={movie_id} onReviewSubmit={handleReviewSubmit} />
        </div>

        {/* Reviews List - Right Side */}
        <div className="lg:col-span-2">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
