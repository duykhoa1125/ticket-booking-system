import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Film } from "lucide-react";
import { Cinema } from "@/services/types";

interface CinemaCardProps {
  cinema: Cinema;
}

export function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <Card className="group overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:border-primary hover:shadow-md flex flex-col h-full rounded-xl">
      {/* Visual Header */}
      <div className="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src="/images/cinema-default.png"
          alt={cinema.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="p-5 flex-1 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
          {cinema.name}
        </h3>
        <div className="flex items-start gap-2.5 text-sm text-slate-500">
          <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
          <span className="line-clamp-2 leading-relaxed">{cinema.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
