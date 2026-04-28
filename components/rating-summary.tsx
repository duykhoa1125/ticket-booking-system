import type { MovieDetail, MovieReview } from "@/services/types";
import { StarIcon } from "lucide-react";

interface RatingSummaryProps {
  movie: MovieDetail;
  reviews: MovieReview[];
}

export function RatingSummary({ movie, reviews }: RatingSummaryProps) {
  const reviewCount = reviews.length;

  // Calculate average rating from reviews
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((acc, review) => acc + review.star_rating, 0) /
        reviewCount
      : movie.avg_rating || 0;

  // Calculate rating distribution from actual reviews
  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    const rating = Math.round(review.star_rating);
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    }
  });

  const maxCount = Math.max(...Object.values(ratingDistribution), 1);

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 min-w-[120px]">
          <span className="text-5xl font-black text-slate-900">
            {avgRating.toFixed(1)}
          </span>
          <div className="flex gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]"
                    : "text-muted stroke-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {reviewCount} đánh giá
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-3 w-full">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = (count / maxCount) * 100;

            return (
              <div key={rating} className="flex items-center gap-3 group">
                <div className="flex items-center gap-1 w-12 justify-end">
                  <span className="text-sm font-bold text-foreground">
                    {rating}
                  </span>
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>

                <div className="h-2.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-xs font-medium text-muted-foreground text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
