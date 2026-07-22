import Link from "next/link";
import { BsFuelPump, BsGearWideConnected } from "react-icons/bs";
import { LuNotebook } from "react-icons/lu";

export default function QuickActions() {
  return (
    <>
    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">
        Quick Actions
      </h3>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link
          href="/add-fuel"
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] py-6 flex flex-col items-center gap-3 hover:bg-zinc-800/40 transition-all"
        >
          <div className="text-blue-500 mb-2">
            <BsFuelPump size={28} />
          </div>
          <span className="font-bold text-sm">Add Fuel</span>
        </Link>
        <Link
          href="/services/add"
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] py-6 flex flex-col items-center gap-3 hover:bg-zinc-800/40 transition-all"
        >
          <div className="text-purple-500 mb-2">
            <BsGearWideConnected size={28} />
          </div>
          <span className="font-bold text-sm">Service</span>
        </Link>
        <Link
          href="/logbook/add"
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-6 flex flex-col items-center gap-3 hover:bg-zinc-800/40 transition-all"
        >
          <div className="text-emerald-500 mb-2">
            <LuNotebook size={28} />
          </div>
          <span className="font-bold text-sm">Logbook</span>
        </Link>
      </div></>
  );
}
