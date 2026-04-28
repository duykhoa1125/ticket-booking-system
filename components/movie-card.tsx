import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { Movie, MovieDetail } from "@/services/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.movie_id}`} className="block h-full">
      <div className="group relative h-full">
        {/* Card Container - The "Frame" */}
        <div className="relative h-full rounded-2xl bg-card border border-border transition-all duration-300 group-hover:border-primary overflow-hidden">
          {/* Inner Content - Clipped */}
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
            {/* Poster */}
            <div className="relative w-full" style={{ aspectRatio: "2 / 3" }}>
              <Image
                src={movie.image || "/placeholder.svg"}
                alt={movie.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4), transparent)",
                }}
              />

              {/* Top Right Rating Badge */}
              {(movie as MovieDetail).avg_rating !== undefined &&
                (movie as MovieDetail).avg_rating! > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-yellow-500 border border-white/10">
                      <Star className="h-3 w-3 fill-yellow-500" />
                      <span>
                        {(movie as MovieDetail).avg_rating!.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

              {/* Age Rating Badge */}
              {movie.age_rating > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="rounded-full bg-red-500/80 px-2.5 py-1 text-xs font-bold text-white border border-red-300/50">
                    {movie.age_rating}+
                  </div>
                </div>
              )}
            </div>

            {/* Content Section - Static */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8), transparent)",
              }}
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {movie.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{movie.duration}′</span>
                  </div>
                  {movie.language && (
                    <div className="bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                      {movie.language}
                    </div>
                  )}
                </div>
              </div>

              {/* Button - Simple reveal */}
              <div className="pt-2">
                <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 text-sm transition-colors">
                  Đặt vé ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
