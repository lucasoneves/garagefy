import MainCard from "@/components/MainCard";
import { IoAlertCircleOutline } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex min-h-screen font-sans ">
      <main className="w-full">
        <MainCard />
        <div className="flex gap-4 items-center mt-4 py-4 px-4 bg-[#2A2210] border border-[#a16920] rounded-2xl">
          <IoAlertCircleOutline size={22} color="#e4870e" />
          <div className="flex-1 flex items-start flex-col">
            <h2 className="text-md font-bold text-[#e4870e]">Maintenance Alert</h2>
            <span className="text-xs text-[#e4870e]">Falta 800km para a troca de óleo</span>
          </div>
          <IoArrowForward size={22} color="#e4870e" />
        </div>
      </main>
    </div>
  );
}
