import { Carousel } from "@/components/carousel";
import { movieService, cinemaService, eventService } from "@/services";
import { MovieTabs } from "@/components/movie-tabs";
import { CinemaCard } from "@/components/cinema-card";
import { EventCard } from "@/components/event-card";
import Link from "next/link";
import { Film, ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Trang chủ - CinemaHub | Đặt vé phim online nhanh chóng",
  description:
    "Khám phá những bộ phim blockbuster và các tác phẩm nghệ thuật đặc sắc. Đặt vé phim online dễ dàng với hệ thống đặt vé thông minh tại CinemaHub. Trải nghiệm điện ảnh đỉnh cao.",
  keywords: [
    "đặt vé phim",
    "rạp chiếu phim",
    "phim đang chiếu",
    "phim sắp chiếu",
    "cinema",
    "movie tickets",
    "đặt vé online",
  ],
  openGraph: {
    title: "CinemaHub - Đặt vé phim online nhanh chóng",
    description: "Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé thông minh",
    type: "website",
  },
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch data in parallel
  let allMovies: Movie[] = [];
  let cinemas: Cinema[] = [];
  let events: Event[] = [];
  let error: string | null = null;

  try {
    const [moviesData, cinemasData, eventsData] = await Promise.all([
      movieService.getAll(),
      cinemaService.getAll(),
      eventService.getAll(),
    ]);

    allMovies = Array.isArray(moviesData) ? moviesData : [];
    cinemas = Array.isArray(cinemasData) ? cinemasData : [];
    events = Array.isArray(eventsData) ? eventsData : [];
  } catch (err) {
    console.error("Failed to fetch data:", err);
    error = "Không thể tải dữ liệu. Vui lòng thử lại sau.";
    // Fallback to empty arrays to allow partial rendering
    allMovies = [];
    cinemas = [];
    events = [];
  }

  const nowShowingMovies = allMovies.filter((m) => m.status === "showing");
  const comingSoonMovies = allMovies.filter((m) => m.status === "upcoming");

  // Filter active events and take top 3
  const activeEvents = events
    // .filter((e) => new Date(e.end_date) >= new Date())
    .slice(0, 3);

  // Take top 3 cinemas
  const featuredCinemas = cinemas.slice(0, 3);

  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-10">
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Film className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Premium Cinema Experience
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Đặt vé phim online
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl text-center">
            Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé thông minh
          </p>
        </div>

        {error ? (
          <div className="h-[500px] w-full flex items-center justify-center rounded-3xl bg-card/50 border border-border/50 glass-card">
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <Film className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : allMovies.length > 0 ? (
          <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <Carousel
              items={nowShowingMovies.length > 0 ? nowShowingMovies : allMovies}
            />
          </div>
        ) : (
          <div className="h-[500px] w-full flex items-center justify-center rounded-3xl bg-card/50 border border-border/50 glass-card">
            <div className="flex flex-col items-center gap-4">
              <Film className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Chưa có phim nào</p>
            </div>
          </div>
        )}
      </section>

      {/* Movie Listings */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Phim đang chiếu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những bộ phim blockbuster và các tác phẩm nghệ thuật đặc
            sắc
          </p>
        </div>

        <MovieTabs
          nowShowingMovies={nowShowingMovies}
          comingSoonMovies={comingSoonMovies}
        />
      </section>

      {/* Featured Events Section */}
      {activeEvents.length > 0 && (
        <section className="bg-muted/30 py-20 border-y border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Tin tức & Sự kiện</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Sự kiện nổi bật
                </h2>
              </div>
              <Link href="/events">
                <span className="group flex items-center gap-2 text-primary font-medium hover:underline">
                  Xem tất cả{" "}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeEvents.map((event, index) => (
                <EventCard
                  key={event.event_id || `event-${index}`}
                  event={event}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Cinemas Section */}
      {featuredCinemas.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
                <MapPin className="w-4 h-4" />
                <span>Hệ thống rạp</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Rạp chiếu phim</h2>
            </div>
            <Link href="/cinemas">
              <span className="group flex items-center gap-2 text-primary font-medium hover:underline">
                Tìm rạp gần bạn{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCinemas.map((cinema, index) => (
              <div
                key={cinema.cinema_id || `cinema-${index}`}
                className="h-full"
              >
                <CinemaCard cinema={cinema} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Section */}
      <section className="border-y border-border/40 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary p-12 shadow-xl transition-all duration-300">
            {/* Content */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-4 text-4xl font-bold text-white">
                  Ưu đãi đặc biệt dành cho bạn
                </h3>
                <p className="mb-8 max-w-2xl text-lg text-white/90 leading-relaxed">
                  Khám phá hàng ngàn voucher giảm giá và chương trình khuyến mãi
                  độc quyền. Đặt vé ngay hôm nay để nhận ưu đãi tốt nhất!
                </p>

                <Link href="/promotions">
                  <button className="group/btn inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 font-bold text-primary shadow-lg transition-all active:scale-95">
                    <span className="text-lg">Xem tất cả ưu đãi</span>
                    <ArrowRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
