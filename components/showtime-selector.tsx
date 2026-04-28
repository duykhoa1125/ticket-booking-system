"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { type Showtime } from "@/services/types";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  movie_id: string;
}

/**
 * Client Component chỉ quản lý UI state (selected date, selected showtime)
 * Showtime data đã bao gồm cinema_name và room_name từ API
 */
export function ShowtimeSelector({
  showtimes,
  movie_id,
}: ShowtimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

  // Format time from start_time (HH:mm:ss)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      month: "short",
    });
  };

  // Group showtimes by date (using start_date)
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = showtime.start_date; // Already in YYYY-MM-DD format
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  const dateKeys = Object.keys(groupedShowtimes).sort();

  // Auto-select first date if none selected
  if (!selectedDate && dateKeys.length > 0) {
    setSelectedDate(dateKeys[0]);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-primary border border-slate-200">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Lịch chiếu
          </h3>
          <p className="text-sm text-muted-foreground">
            Chọn ngày và suất chiếu phù hợp
          </p>
        </div>
      </div>

      {/* Date Selector - Premium Pills */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {dateKeys.map((date) => {
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString("vi-VN", {
              weekday: "short",
            });
            const dayNum = dateObj.getDate();
            const monthName = getMonthName(date);
            const isSelected = selectedDate === date;

            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShowtime(null);
                }}
                className={cn(
                  "group relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-6 py-4 transition-all duration-300 snap-start min-w-[100px]",
                  isSelected
                    ? "border-primary bg-primary shadow-md scale-105"
                    : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isSelected
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground group-hover:text-primary"
                  )}
                >
                  {dayName}
                </span>
                <span
                  className={cn(
                    "text-3xl font-black",
                    isSelected ? "text-white" : "text-foreground"
                  )}
                >
                  {dayNum}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showtimes for selected date */}
      {selectedDate && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-1">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Lịch chiếu ngày{" "}
              <span className="font-bold text-primary">
                {formatDate(selectedDate)}
              </span>
            </p>
          </div>

          {/* Group by Cinema */}
          {(() => {
            const showtimesForDate = groupedShowtimes[selectedDate];
            // Group by cinema_name (available directly from showtime data)
            const showtimesByCinema = showtimesForDate.reduce(
              (acc, showtime) => {
                const cinemaName = showtime.cinema_name || "Rạp không xác định";

                if (!acc[cinemaName]) {
                  acc[cinemaName] = [];
                }
                acc[cinemaName].push(showtime);
                return acc;
              },
              {} as Record<string, Showtime[]>
            );

            return Object.entries(showtimesByCinema).map(
              ([cinemaName, cinemaShowtimes]) => {
                return (
                  <div key={cinemaName} className="space-y-4">
                    {/* Cinema Header */}
                    <div className="flex items-center gap-2 border-l-4 border-primary pl-4 py-1 bg-muted/30 rounded-r-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-bold text-foreground">
                        {cinemaName}
                      </h4>
                    </div>

                    {/* Showtimes Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pl-4">
                      {cinemaShowtimes.map((showtime) => {
                        const isSelected =
                          selectedShowtime === showtime.showtime_id;

                        return (
                          <div
                            key={showtime.showtime_id}
                            onClick={() =>
                              setSelectedShowtime(
                                isSelected ? null : showtime.showtime_id
                              )
                            }
                            className={cn(
                              "group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
                              isSelected
                                ? "border-2 border-primary bg-white shadow-md scale-[1.02]"
                                : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:-translate-y-1"
                            )}
                          >
                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="absolute top-0 right-0 p-2">
                                <div className="bg-primary text-primary-foreground rounded-bl-xl rounded-tr-lg p-1 shadow-sm">
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                </div>
                              </div>
                            )}

                            <div className="p-5">
                              {/* Status Badge */}

                              {/* Time Display */}
                              <div className="mb-4 flex items-baseline gap-2">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                  <Clock className="h-6 w-6" />
                                </div>
                                <span className="text-3xl font-black tracking-tight text-foreground">
                                  {formatTime(showtime.start_time)}
                                </span>
                              </div>

                              {/* Room Info */}
                              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium px-2 py-1 bg-muted rounded text-xs uppercase tracking-wider">
                                  {showtime.room_name || showtime.room_id}
                                </span>
                              </div>

                              {/* Price */}
                              {isSelected && (
                                <div className="mt-4 h-1 w-full rounded-full bg-primary animate-pulse" />
                              )}
                            </div>

                            {/* Book Button Overlay */}
                            <div
                              className={cn(
                                "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
                                isSelected
                                  ? "opacity-100 visible"
                                  : "opacity-0 invisible pointer-events-none"
                              )}
                            >
                              <Link
                                href={`/book-ticket/${showtime.showtime_id}`}
                                className="w-full px-6"
                              >
                                <Button className="w-full bg-primary hover:bg-primary/90 shadow-md text-lg font-bold h-12 rounded-xl group-hover:scale-105 transition-transform">
                                  Đặt vé ngay{" "}
                                  <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            );
          })()}
        </div>
      )}

      {/* Empty State */}
      {dateKeys.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 py-20 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">
            Chưa có lịch chiếu
          </h4>
          <p className="text-muted-foreground">
            Vui lòng quay lại sau để xem lịch chiếu mới nhất
          </p>
        </div>
      )}
    </div>
  );
}
