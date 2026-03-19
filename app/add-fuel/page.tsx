import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button"

export default function AddFuel() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex gap-2 items-center">
        <Link href="/" className="flex items-center absolute">
          <IoArrowBackOutline size={20} />
        </Link>
        <h1 className="text-lg font-bold flex-1 text-center">Add Fuel</h1>
      </header>

      <form action="" className="flex flex-col gap-6">
        <label htmlFor="fuel-amount" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Posto de gasolina</strong>
          <input
            placeholder="Shell, Ipiranga..."
            type="text"
            id="fuel-amount"
            name="fuel-amount"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
          />
        </label>
        <label htmlFor="fuel-type" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Tipo de combustível</strong>
          <select
            id="fuel-type"
            name="fuel-type"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm appearance-none"
          >
            <option defaultValue="Selecione o tipo">Selecione o tipo</option>
            <option value="gasoline">Gasolina</option>
            <option value="ethanol">Etanol</option>
            <option value="diesel">Diesel</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="total-cost" className="flex flex-col gap-2 relative">
            <strong className="text-sm text-zinc-400">Valor total</strong>
            <input
              placeholder="R$ 0,00"
              type="number"
              id="total-cost"
              name="total-cost"
              className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
            />
          </label>

          <label
            htmlFor="price-per-liter"
            className="flex flex-col gap-2 relative"
          >
            <strong className="text-sm text-zinc-400">Preço/Litro</strong>
            <input
              placeholder="R$ 0,00"
              type="number"
              id="price-per-liter"
              name="price-per-liter"
              className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
            />
          </label>
        </div>
        <label htmlFor="total-liters" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Total de litros</strong>
          <input
            placeholder="0.00"
            type="number"
            id="total-liters"
            name="total-liters"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
          />
        </label>

        <label htmlFor="current-km" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Km atual</strong>
          <input
            placeholder="0.00"
            type="number"
            id="current-km"
            name="current-km"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
          />
        </label>

        <label htmlFor="date-time" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Data</strong>
          <input
            
            type="date"
            id="date-time"
            name="date-time"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-6 text-sm"
          />
        </label>
        <div className="submit-form flex gap-4 justify-end">
          <Button type="submit" className="p-6 text-black bg-zinc-400 rounded-full cursor-pointer max-w-28">Limpar</Button>
        <Button type="submit" className="p-6 text-white bg-[#007BFF] rounded-full cursor-pointer max-w-28">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
