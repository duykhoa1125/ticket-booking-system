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
        {/* Card Container */}
        <div className="relative h-full rounded-xl bg-white border border-slate-200 transition-all duration-300 group-hover:border-primary group-hover:shadow-md overflow-hidden flex flex-col">
          {/* Poster Section */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 3" }}>
            <Image
              src={movie.image || "/placeholder.svg"}
              alt={movie.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Right Rating Badge */}
            {(movie as MovieDetail).avg_rating !== undefined &&
              (movie as MovieDetail).avg_rating! > 0 && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-slate-900 border border-slate-200 shadow-sm">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span>
                      {(movie as MovieDetail).avg_rating!.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

            {/* Age Rating Badge */}
            {movie.age_rating > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="rounded-lg bg-slate-900/80 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white border border-white/10">
                  {movie.age_rating}+
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-1 bg-white">
            <div className="flex flex-col gap-1 mb-4 flex-1">
              <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                {movie.name}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{movie.duration} phút</span>
                </div>
                {movie.language && (
                  <div className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    {movie.language}
                  </div>
                )}
              </div>
            </div>

            {/* Button */}
            <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 text-xs transition-all active:scale-95 shadow-sm">
              Đặt vé ngay
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
