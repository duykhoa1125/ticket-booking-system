"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cinemaService } from "@/services";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Film, ArrowRight } from "lucide-react";
import { CinemaCard } from "@/components/cinema-card";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<any[]>([]);

  useEffect(() => {
    cinemaService
      .getAll()
      .then((data) => setCinemas(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setCinemas([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Hệ thống rạp chiếu
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trải nghiệm điện ảnh đỉnh cao tại hệ thống rạp hiện đại bậc nhất. 
            Tìm rạp gần bạn nhất ngay hôm nay.
          </p>
        </div>

        {/* Cinema List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cinemas.map((cinema) => (
            <CinemaCard key={cinema.cinema_id} cinema={cinema} />
          ))}
        </div>

        {cinemas.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <Film className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Không tìm thấy rạp nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
