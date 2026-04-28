"use client";

import { MovieGrid } from "@/components/movie-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import type { Movie } from "@/services/types";

interface MovieTabsProps {
  nowShowingMovies: Movie[];
  comingSoonMovies: Movie[];
}

/**
 * Client Component chỉ quản lý tab state
 * Phần render movies được delegate cho MovieGrid Server Component
 */
export function MovieTabs({
  nowShowingMovies,
  comingSoonMovies,
}: MovieTabsProps) {
  const [activeTab, setActiveTab] = useState("now-showing");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-8"
    >
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/30 rounded-full border border-border/50">
          <TabsTrigger
            value="now-showing"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Đang chiếu ({nowShowingMovies.length})
          </TabsTrigger>
          <TabsTrigger
            value="coming-soon"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Sắp chiếu ({comingSoonMovies.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="now-showing"
        className="mt-0"
      >
        <MovieGrid
          movies={nowShowingMovies}
          emptyMessage="Không có phim đang chiếu"
          emptyIcon="sparkles"
        />
      </TabsContent>

      <TabsContent
        value="coming-soon"
        className="mt-0"
      >
        <MovieGrid
          movies={comingSoonMovies}
          emptyMessage="Không có phim sắp chiếu"
          emptyIcon="clock"
        />
      </TabsContent>
    </Tabs>
  );
}
