import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { Event } from "@/services/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const now = new Date();

  let statusText = "Sắp diễn ra";
  let statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";

  if (now >= startDate && now <= endDate) {
    statusText = "Đang diễn ra";
    statusColor = "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (now > endDate) {
    statusText = "Đã kết thúc";
    statusColor = "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }

  return (
    <Card className="group overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:border-primary hover:shadow-md h-full flex flex-col rounded-xl">
      {/* Visual Header */}
      <div className="relative aspect-video overflow-hidden shrink-0 bg-slate-100 border-b border-slate-100">
        <img
          src="/images/event-default.png"
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm border-slate-200 text-xs font-semibold px-2 py-0.5">
            {statusText}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 line-clamp-1">
            {event.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {startDate.toLocaleDateString("vi-VN")} - {endDate.toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Full Description */}
        <div className="flex-1">
          <div className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none">
            <p className="leading-relaxed whitespace-pre-line">
              {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
