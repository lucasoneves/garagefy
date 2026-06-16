const VehicleCardSkeleton = () => (
  <div className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 w-20 bg-zinc-800 rounded-md" />
      <div className="flex gap-1.5">
        <div className="h-8 w-8 bg-zinc-800 rounded-xl" />
        <div className="h-8 w-8 bg-zinc-800 rounded-xl" />
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-full">
        <div className="flex gap-4 items-baseline justify-between">
          <div className="h-7 w-40 bg-zinc-800 rounded-lg" />
          <div className="h-5 w-24 bg-zinc-800 rounded-md" />
        </div>
        <div className="flex gap-3">
          <div className="h-4 w-16 bg-zinc-800 rounded-md" />
          <div className="h-4 w-4 bg-zinc-800 rounded-full" />
          <div className="h-4 w-28 bg-zinc-800 rounded-md" />
        </div>
        <div className="pt-2 border-t border-zinc-900/40">
          <div className="h-4 w-32 bg-zinc-800 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

export default VehicleCardSkeleton;
