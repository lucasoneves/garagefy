import Image from "next/image";
import Link from "next/link";
import { MdOutlineSpeed } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

interface MainCardProps {
  vehicleId: string;
  brand: string;
  model: string;
  currentOdometer: number;
  status?: string;
}

export default function MainCard({ vehicleId, brand, model, currentOdometer, status = "Active" }: MainCardProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-8 mb-6 border border-zinc-800/50">
      <div className="relative z-10 flex flex-col h-[200px]">
        <div className="flex justify-between items-start">
          <h3 className="text-4xl font-bold max-w-[200px] leading-tight">
            {brand} {model}
          </h3>
          <Link
            href={`/my-garage/edit/${vehicleId}`}
            className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 p-2 rounded-xl hover:bg-zinc-700/80 hover:text-blue-400 transition-all border border-zinc-700/50"
          >
            <BiEdit size={18} />
          </Link>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-2 text-zinc-400">
            <MdOutlineSpeed size={20} />
            <span className="font-medium">{currentOdometer.toLocaleString("pt-BR")} KM</span>
          </div>
          <span className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest border border-zinc-700/50">
            {status}
          </span>
        </div>
        <Image
          src="/car-side-view.png"
          alt="Car view"
          className="absolute right-0 bottom-4 w-4/5 opacity-40 object-contain pointer-events-none"
          width={1200}
          height={600}
          priority
        />
      </div>
    </section>
  );
}
