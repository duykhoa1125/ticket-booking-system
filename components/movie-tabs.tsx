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
        <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 border border-slate-200">
          <TabsTrigger
            value="now-showing"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Đang chiếu ({nowShowingMovies.length})
          </TabsTrigger>
          <TabsTrigger
            value="coming-soon"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
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
