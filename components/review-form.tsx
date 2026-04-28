"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, Send, Loader2, Edit3, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { reviewService } from "@/services";
import type { MovieReview } from "@/services/types";

interface ReviewFormProps {
  movie_id: string;
  onReviewSubmit?: (review: MovieReview) => void;
}

/**
 * Client Component để viết/chỉnh sửa review
 * Mỗi user chỉ được viết 1 review cho mỗi phim
 */
export function ReviewForm({ movie_id, onReviewSubmit }: ReviewFormProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(10); // Default 10/10
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  // Fetch existing review when component mounts or user changes
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!currentUser || currentUser.role !== "user") return;

      setIsLoadingExisting(true);
      try {
        const response = await reviewService.getMyReview(movie_id);

        // `axiosClient` unwraps successful responses to the `data` object directly
        const reviewData = response as Partial<MovieReview> | undefined;
        const hasReviewData = Boolean(
          reviewData &&
          (reviewData.star_rating !== undefined || reviewData.review_content),
        );

        if (hasReviewData && reviewData) {
          // API returns star_rating as 1-5, convert to 1-10 for UI
          if (typeof reviewData.star_rating === "number") {
            setRating(reviewData.star_rating * 2);
          }
          if (reviewData.review_content) {
            setContent(reviewData.review_content);
          }
          setHasExistingReview(true);
        } else {
          // Ensure UI shows "new review" state when no review exists
          setRating(10);
          setContent("");
          setHasExistingReview(false);
        }
      } catch {
        // No existing review or error - that's fine, user can create new
        setHasExistingReview(false);
      } finally {
        setIsLoadingExisting(false);
      }
    };

    fetchExistingReview();
  }, [currentUser, movie_id]);

  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để viết đánh giá.",
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length === 0) {
      toast({
        title: "Nội dung trống",
        description: "Vui lòng nhập nội dung đánh giá.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the actual API
      // UI uses 1-10 scale (5 stars × 2), but API expects 1-5 scale
      await reviewService.submitReview(movie_id, {
        rating: Math.round(rating / 2), // Convert from 1-10 to 1-5
        content: content.trim(),
      });

      // Create review object for optimistic update
      // Handle different user types (AccountWithRole vs StaffWithRole)
      const getUserName = () => {
        if (currentUser.role === "user") {
          return currentUser.fullname;
        }
        return currentUser.name;
      };

      const getUserAvatar = () => {
        if (currentUser.role === "user") {
          return currentUser.avatar || undefined;
        }
        return undefined;
      };

      const review: MovieReview = {
        phone_number: currentUser.phone_number,
        movie_id: movie_id,
        date_written: new Date().toISOString(),
        star_rating: Math.round(rating / 2), // Use API scale for the returned object
        review_content: content,
        reviewer_name: getUserName(),
        reviewer_avatar: getUserAvatar(),
      };

      // Callback to parent if provided
      if (onReviewSubmit) {
        onReviewSubmit(review);
      }

      // Mark as having existing review now
      setHasExistingReview(true);

      toast({
        title: hasExistingReview
          ? "Cập nhật đánh giá thành công"
          : "Đánh giá thành công",
        description: "Cảm ơn bạn đã chia sẻ đánh giá!",
      });
    } catch (error: unknown) {
      console.error("Submit review error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi đánh giá";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = content.trim().length > 0;

  // Show loading state while fetching existing review
  if (isLoadingExisting) {
    return (
      <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
      <h3 className="mb-6 text-lg font-bold flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        {hasExistingReview ? (
          <>
            <Edit3 className="w-4 h-4 text-primary" />
            Chỉnh sửa đánh giá
          </>
        ) : (
          "Viết đánh giá của bạn"
        )}
      </h3>

      {hasExistingReview && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>
            Bạn đã đánh giá phim này. Bạn có thể chỉnh sửa đánh giá bên dưới.
          </span>
        </div>
      )}

      <div className="space-y-5">
        {/* Rating Stars */}
        <div>
          <label className="mb-3 block text-sm font-medium text-muted-foreground">
            Đánh giá
          </label>
          <div className="flex gap-2 justify-center p-4 bg-muted/30 rounded-xl border border-border/50">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star * 2)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-all duration-300 ${
                    star * 2 <= rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                      : "text-muted stroke-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-sm font-bold text-primary">
            {rating}/10 điểm
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Nội dung
          </label>
          <Textarea
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={500}
            className="resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <p className="text-xs text-right text-muted-foreground">
            {content.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || !currentUser || isSubmitting}
          className="w-full gap-2 bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 font-bold h-11"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              {hasExistingReview ? (
                <Edit3 className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {!currentUser
                ? "Đăng nhập để đánh giá"
                : hasExistingReview
                  ? "Cập nhật đánh giá"
                  : "Gửi đánh giá"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
