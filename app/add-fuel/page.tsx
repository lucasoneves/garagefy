import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { TbGasStation } from "react-icons/tb";
import { RiShapesLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { DatePicker } from "@heroui/date-picker";

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
          <TbGasStation
            className="text-zinc-400 absolute bottom-3.5 left-3.5"
            size={20}
          />
          <strong className="text-sm text-zinc-400">Posto de gasolina</strong>
          <input
            placeholder="Shell, Ipiranga..."
            type="text"
            id="fuel-amount"
            name="fuel-amount"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm"
          />
        </label>
        <label htmlFor="fuel-type" className="flex flex-col gap-2 relative">
          <RiShapesLine
            className="text-zinc-400 absolute bottom-3.5 left-3.5"
            size={20}
          />
          <strong className="text-sm text-zinc-400">Tipo de combustível</strong>
          <select
            id="fuel-type"
            name="fuel-type"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm appearance-none"
          >
            <option defaultValue="Selecione o tipo">Selecione o tipo</option>
            <option value="gasoline">Gasolina</option>
            <option value="ethanol">Etanol</option>
            <option value="diesel">Diesel</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="total-cost" className="flex flex-col gap-2 relative">
            <MdAttachMoney
              className="text-zinc-400 absolute bottom-3.5 left-3.5"
              size={20}
            />
            <strong className="text-sm text-zinc-400">Valor total</strong>
            <input
              placeholder="R$ 0,00"
              type="number"
              id="total-cost"
              name="total-cost"
              className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm"
            />
          </label>

          <label
            htmlFor="price-per-liter"
            className="flex flex-col gap-2 relative"
          >
            <MdAttachMoney
              className="text-zinc-400 absolute bottom-3.5 left-3.5"
              size={20}
            />
            <strong className="text-sm text-zinc-400">Preço/Litro</strong>
            <input
              placeholder="R$ 0,00"
              type="number"
              id="price-per-liter"
              name="price-per-liter"
              className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm"
            />
          </label>
        </div>
        <label htmlFor="total-liters" className="flex flex-col gap-2 relative">
          <MdOutlineWaterDrop
            className="text-zinc-400 absolute bottom-3.5 left-3.5"
            size={20}
          />
          <strong className="text-sm text-zinc-400">Total de litros</strong>
          <input
            placeholder="0.00"
            type="number"
            id="total-liters"
            name="total-liters"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm"
          />
        </label>

        <label htmlFor="current-km" className="flex flex-col gap-2 relative">
          <MdOutlineWaterDrop
            className="text-zinc-400 absolute bottom-3.5 left-3.5"
            size={20}
          />
          <strong className="text-sm text-zinc-400">Km atual</strong>
          <input
            placeholder="0.00"
            type="number"
            id="current-km"
            name="current-km"
            className="bg-[#121212] h-12 border border-zinc-600 rounded-full text-zinc-400 py-1 px-3 pl-10 text-sm"
          />
        </label>

        <label htmlFor="date-time" className="flex flex-col gap-2 relative">
          <strong className="text-sm text-zinc-400">Data</strong>

          <DatePicker
            selectorButtonPlacement="start"
            selectorIcon={<IoCalendarOutline size={18} />}
            classNames={{
              // Alinhamento vertical do ícone e margem para desgrudar do texto
              selectorButton: "flex items-center mr-2",

              // Altura h-12, borda zinc-400, largura total e alinhamento vertical
              inputWrapper:
                "w-full h-12 px-4 bg-[#121212] border-zinc-600 border rounded-full flex items-center shadow-none",

              // Garante que o container interno dos segmentos também ocupe o espaço e alinhe ao centro
              input: "flex items-center w-full",

              // Cor e alinhamento do placeholder/texto mm/dd/yyyy
              segment: "text-zinc-400 text-sm flex items-center",
            }}
            // Define a largura do componente pai como 100%
            className="w-full"
          />
        </label>
      </form>
    </div>
  );
}
