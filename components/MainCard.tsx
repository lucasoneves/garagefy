import Image from "next/image";
import { MdOutlineSpeed } from "react-icons/md";

export default function MainCard() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-8 mb-6 border border-zinc-800/50">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-16">
          <h3 className="text-4xl font-bold max-w-[200px] leading-tight">
            Volkswagen Gol 1.6
          </h3>
          <span className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest border border-zinc-700/50">
            Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <MdOutlineSpeed size={20} />
          <span className="font-medium">55.200 KM</span>
        </div>
        {/* Imagem do Carro (Background) */}
        <Image
          src="/car-side-view.png" // Certifique-se de ter uma imagem transparente aqui
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
