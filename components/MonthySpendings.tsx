import { IoCalendarOutline } from "react-icons/io5";

export default function MonthlySpendings() {
  return (
    <div className="rounded-2xl bg-[#121212] shadow-sm mt-6 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-[#B0B0B0]">Gasto mensal</h2>
        <div className="flex items-center gap-2 bg-[#007BFF] rounded-full px-4 py-2">
          <IoCalendarOutline size={18} color="#fff" />
          <span className="text-white text-xs ">Fevereiro 2026</span>
        </div>
      </div>
      <span className="font-bold text-2xl">R$ 200,00</span>
      <div>chart (em breve)</div>
    </div>
  );
}
