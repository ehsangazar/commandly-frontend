import { backgrounds, getSavedBackgroundIndex } from "@/utils/backgrounds";

const DashboardLayoutLoadingSkeleton = () => {
  const currentBackground =
    backgrounds[getSavedBackgroundIndex()] || backgrounds[0];

  return (
    <div
      className="w-full flex items-center gap-6 p-6 relative h-screen"
      style={{ backgroundImage: `url(${currentBackground.url})` }}
    >
      {/* Sidebar Skeleton */}
      <div className="w-20 h-full rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
          <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="relative flex-1 overflow-auto h-full">
        <div className="grid grid-cols-12 gap-6 auto-rows-min">
          {/* Stats Widget Skeleton */}
          <div className="col-span-4 row-span-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-black/20 border border-white/5"
                >
                  <div className="h-4 w-16 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Clips Widget Skeleton */}
          <div className="col-span-4 row-span-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-black/20 border border-white/5"
                >
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Clock Widget Skeleton */}
          <div className="col-span-2 row-span-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="h-24 w-24 rounded-full bg-white/5 animate-pulse mx-auto" />
          </div>

          {/* Diagram Widget Skeleton */}
          <div className="col-span-4 row-span-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="h-48 bg-white/5 rounded-lg animate-pulse" />
          </div>

          {/* Chat Widget Skeleton */}
          <div className="col-span-3 row-span-1 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutLoadingSkeleton;
