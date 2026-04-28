import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Film } from "lucide-react";
import { Cinema } from "@/services/types";

interface CinemaCardProps {
  cinema: Cinema;
}

export function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/40 transition-colors flex flex-col h-full shadow-sm">
      {/* Decorative Header */}
      <div className="relative h-32 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-12 h-12 text-primary/20" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {cinema.name}
          </h3>
        </div>
      </div>

      <CardContent className="p-6 flex-1 space-y-4">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span className="line-clamp-2">{cinema.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
