"use client";

import { useState } from "react";
import Link from "next/link";
import { HiPlus, HiChevronDown } from "react-icons/hi";
import PageNavHeader from "@/components/PageNavHeader";
import BottomNav from "@/components/BottomNav";

// Mock de dados baseado fielmente na imagem do Stitch
const initialEntries = [
  {
    id: 1,
    category: "OBSERVATION",
    date: "May 20",
    title: "Odd noise when braking",
    description:
      "Heard a faint squealing sound coming from the front left wheel when applying moderat...",
    bgType: "standard",
  },
  {
    id: 2,
    category: "REMINDER",
    date: "May 18",
    title: "Check tire pressure",
    description:
      "Front tires looking a bit soft after the long trip to the coast. Need to calibrate for...",
    bgType: "standard",
  },
  {
    id: 3,
    category: "OBSERVATION",
    date: "May 12",
    title: "Oil Level Inspection",
    description:
      "Checked dipstick this morning. Level is halfway between min and max. Color looks...",
    bgType: "standard",
  },
  {
    id: 4,
    category: "MAINTENANCE",
    date: "May 05",
    title: "New Air Filter Installed",
    description:
      "Replaced OEM filter with high-performance variant. Immediate improvement in throttle...",
    bgType: "standard", // Indica que este card possui a imagem de fundo do painel
  },
];

const filters = ["ALL", "REMINDERS"];

const LogbookPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans relative">
      <PageNavHeader pageTitle="Logbook" cancelable={false} />

      {/* Sub-header e Filtros Rápidos */}
      <section className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase ml-1">
          Recent Entries
        </h2>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${
                activeFilter === filter
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-900/40 text-zinc-500 hover:text-zinc-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de Notas (Feed do Logbook) */}
      <section className="space-y-4">
        {initialEntries.map((entry) => (
          <div
            key={entry.id}
            className={`rounded-[2rem] relative overflow-hidden transition-all border border-zinc-900/50 flex flex-col justify-between ${
              entry.bgType === "image"
                ? "min-h-[260px] bg-cover bg-center p-6 items-start"
                : "bg-[#121212] p-6"
            }`}
            style={
              entry.bgType === "image"
                ? // Imagem vetorial escura simulando o painel de instrumentos (odômetro/alerta) em background com overlay escuro
                  {
                    backgroundImage: `linear-gradient(to top, rgba(18,18,18,1) 45%, rgba(18,18,18,0.75) 100%), url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop')`,
                  }
                : undefined
            }
          >
            {/* Elementos Superiores do Card: Tag e Data */}
            <div className="flex justify-between items-center w-full mb-4">
              <span
                className={`text-[9px] font-black px-3 py-1 rounded-md tracking-widest uppercase ${
                  entry.category === "REMINDER"
                    ? "bg-amber-500/10 text-amber-500"
                    : entry.category === "MAINTENANCE"
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {entry.category}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {entry.date}
              </span>
            </div>

            {/* Conteúdo do Card */}
            <div className="w-full pr-4 flex-grow">
              <h3 className="text-lg font-bold tracking-tight text-zinc-100 mb-2">
                {entry.title}
              </h3>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                {entry.description}
              </p>
            </div>

            {/* Botão de Expansão no Rodapé */}
            <div className="w-full flex justify-end mt-4 text-zinc-600">
              <HiChevronDown size={20} />
            </div>
          </div>
        ))}
      </section>

      {/* Botão Flutuante Centralizado: Add Entry */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <Link
          href="/logbook/add"
          className="pointer-events-auto bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-[0.97] transition-all"
        >
          <HiPlus size={20} />
          <span className="text-xs font-black uppercase tracking-widest">
            Add Entry
          </span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
};

export default LogbookPage;
