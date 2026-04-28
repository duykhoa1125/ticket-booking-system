import { Skeleton } from "@/components/ui/skeleton";

type RouteLoadingProps = {
  variant: "confirmation" | "events" | "promotions";
};

export function RouteLoading({ variant }: RouteLoadingProps) {
  if (variant === "confirmation") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="border-b border-border/40 bg-card/50 sticky top-0 z-40">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-16">
          <div className="mb-12 text-center space-y-6 flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 max-w-md" />
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/50">
                <div className="h-24 bg-muted/30 flex flex-col items-center justify-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-40" />
                </div>
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="rounded-2xl border border-border/50 p-5 space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <div className="h-px bg-border/50" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              <Skeleton className="h-48 w-full rounded-3xl" />
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-3xl border border-border/50 bg-card/50 p-6 flex flex-col items-center gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-40 w-40 rounded-xl" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-40 w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "events") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="mb-16 text-center space-y-6 flex flex-col items-center">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-20 w-3/4 max-w-2xl" />
            <Skeleton className="h-6 w-1/2 max-w-xl" />
          </div>

          <div className="mb-16 max-w-xl mx-auto">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/30 overflow-hidden h-full flex flex-col"
              >
                <Skeleton className="aspect-video w-full" />

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  <div className="pt-4 mt-auto border-t border-border/50">
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mb-16 text-center space-y-6 flex flex-col items-center">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-20 w-3/4 max-w-2xl" />
          <Skeleton className="h-10 w-64 rounded-full" />
        </div>

        <div className="mb-16 max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[280px] rounded-2xl border border-border/50 p-6 flex items-start justify-between gap-6 bg-card/30"
            >
              <div className="flex-1 space-y-5">
                <div className="flex gap-5">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
