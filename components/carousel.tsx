"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/services/types";

interface CarouselProps {
  items: Movie[];
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = () =>
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  const next = () => setCurrent((prev) => (prev + 1) % items.length);

  if (items.length === 0) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-background shadow-2xl border border-border/50 group">
      {items.map((item, index) => (
        <div
          key={item.movie_id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          {/* Subtle Overlay for readability */}
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                {item.name}
              </h2>

              <p className="max-w-2xl line-clamp-2 text-lg text-gray-200/90 font-light">
                {item.synopsis || ""}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-300 pt-2">
                <div className="flex items-center gap-2">
                  <span>⏱️ {item.duration} phút</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/40 border border-white/20 p-3 transition-all hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-slate-900" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/40 border border-white/20 p-3 transition-all hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-slate-900" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 right-12 z-10 flex gap-2.5">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
