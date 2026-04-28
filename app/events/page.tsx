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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredEvents = events.filter((event) => {
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <RouteLoading variant="events" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>Sự Kiện & Tin Tức</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Khám Phá Sự Kiện Mới
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Cập nhật những tin tức mới nhất và các sự kiện hấp dẫn đang diễn ra
            tại rạp chiếu phim CinemaHub.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-16 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm">
              <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Không tìm thấy sự kiện nào
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi từ khóa tìm kiếm của bạn.
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
