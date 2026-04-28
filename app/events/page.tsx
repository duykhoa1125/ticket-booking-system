"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { eventService } from "@/services";
import { Event } from "@/services/types";
import { EventCard } from "@/components/event-card";
import { RouteLoading } from "@/components/route-loading";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAll();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Không thể tải danh sách sự kiện");
        setEvents([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  if (loading) {
    return <RouteLoading variant="events" />;
  }

  if (error) {
    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="relative mx-auto max-w-7xl px-6 py-16 w-full">
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Sự kiện & Tin tức
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất và các sự kiện hấp dẫn đang diễn ra
            tại rạp chiếu phim CinemaHub.
          </p>
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>

      </div>
    </div>
  );
}
