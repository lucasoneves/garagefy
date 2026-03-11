import IconOdometer from "@/components/Icons/Odometer";

export default function Home() {
  return (
    <div className="flex min-h-screen font-sans ">
      <main className="w-full">
        <div
          className="car-info justify-end p-4 rounded-2xl flex flex-col gap-4 min-h-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(10,15,16,0.6), rgba(0,1,1,0.6)), url('/images/tcross.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex gap-2 justify-between items-center">
            <span className="font-bold text-xl">Volkswagen TCross</span>
          </div>
          <div className="text-sm text-[#CBD5E1] flex gap-2 items-center justify-between">
            <span className="flex gap-2 items-center">
              <IconOdometer />55.200 KM
            </span>
            <span className="rounded-full py-1 bg-[#04395d] text-xs px-3 font-bold">
              Active
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
