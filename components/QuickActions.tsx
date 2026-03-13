export default function QuickActions() {
  return (
    <div className="mt-6">
      <h2 className="uppercase text-sm text-[#B0B0B0] mb-2">Quick Actions</h2>
      <div className="flex gap-8">
        <button className="bg-[#121212] text-white px-6 py-10 flex-1 rounded-2xl">
          Add Fuel
        </button>
        <button className="bg-[#121212] text-white px-6 flex-1 py-10 rounded-2xl">
          Service
        </button>
      </div>
    </div>
  );
}
