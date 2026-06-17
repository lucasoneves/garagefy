"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { BiPlus, BiTrash, BiTimeFive } from "react-icons/bi";
import { api, swrFetcher } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import PageDescription from "@/components/ui/PageDescription";
import FilterTab, { FilterOption } from "@/components/ui/FilterTab";

interface LogbookEntry {
  id: string;
  vehicle_id: string;
  category: "Observation" | "Reminder" | "To-do";
  title: string;
  description: string;
  created_at: string;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Entries" },
  { value: "Observation", label: "Observations" },
  { value: "Reminder", label: "Reminders" },
  { value: "To-do", label: "To-dos" },
];

const LogbookListPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Estado dinâmico para substituir o MOCK_VEHICLE_ID antigo
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  // 1. Carrega o ID do veículo ativo selecionado na Garagem
  // 1. Carrega o ID do veículo ativo selecionado na Garagem com segurança
  useEffect(() => {
    const savedVehicleId = localStorage.getItem("@garagefy:active_vehicle_id");

    if (!savedVehicleId) {
      api.get("/vehicles").then((res) => {
        const vehicles = res.data;
        if (vehicles?.length > 0) {
          const firstId = vehicles[0].id;
          localStorage.setItem("@garagefy:active_vehicle_id", firstId);
          setVehicleId(firstId);
        }
      });
    } else {
      setVehicleId(savedVehicleId);
    }
  }, [router]);

  const apiUrl = vehicleId
    ? `/vehicles/${vehicleId}/logbook`
    : null;

  const {
    data: entries = [],
    error,
    isLoading,
    mutate,
  } = useSWR<LogbookEntry[]>(apiUrl, swrFetcher);

  const filteredEntries = activeFilter === "all"
    ? entries
    : entries.filter((e) => e.category === activeFilter);

  // Função para Deletar um registro (DELETE) usando o ID dinâmico
  const handleDelete = async (id: string) => {
    if (!vehicleId || !confirm("Tem certeza que deseja remover esta entrada?")) return;

    try {
      await api.delete(`/vehicles/${vehicleId}/logbook/${id}`);
      // Alerta o SWR para atualizar o cache local instantaneamente
      mutate();
    } catch (error) {
      console.error("Erro na exclusão:", error);
      alert("Erro ao deletar o registro.");
    }
  };

  // Impede a renderização enquanto o localStorage não for mapeado
  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <p className="text-zinc-500 text-sm animate-pulse">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans">
      <PageNavHeader pageTitle="Vehicle Logbook" lastPage="/dashboard" />

      {/* Header com Botão de Adicionar */}
      <div className="mt-6 flex items-center justify-between px-1">
        <PageDescription
          pageTitle="Logbook History"
          pageDescription="Manage events and notes"
        />
        <Link
          href="/logbook/add"
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-500/10"
        >
          <BiPlus size={20} />
        </Link>
      </div>

      {/* Abas de Filtro Componentizadas */}
      <div className="mt-6">
        <FilterTab
          options={filterOptions}
          selectedValue={activeFilter}
          onChange={(value) => setActiveFilter(value)}
          size="small"
        />
      </div>

      {/* Listagem Dinâmica */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-sm text-zinc-500 font-medium text-center py-10">
            Loading entries...
          </p>
        ) : error ? (
          <p className="text-sm text-red-400 font-medium text-center py-10">
            Failed to load logbook entries.
          </p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-sm text-zinc-500 font-medium text-center py-10">
            No entries found for this category.
          </p>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#121212] border border-zinc-900/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Top Card: Categoria e Data */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    entry.category === "Reminder"
                      ? "bg-amber-500/5 text-amber-400 border-amber-500/10"
                      : entry.category === "To-do"
                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                        : "bg-blue-500/5 text-blue-400 border-blue-500/10"
                  }`}
                >
                  {entry.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                  <BiTimeFive size={14} />
                  <span>
                    {new Date(entry.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Corpo: Título e Conteúdo */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-200">
                  {entry.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {entry.description}
                </p>
              </div>

              {/* Footer Card: Ações */}
              <div className="flex items-center justify-end pt-2 border-t border-zinc-900/40 gap-2">
                <Link
                  href={`/logbook/edit/${entry.id}`}
                  className="text-zinc-500 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-500/5 border border-transparent hover:border-blue-500/10 transition-all text-xs font-bold"
                  title="Edit entry"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all"
                  title="Delete entry"
                >
                  <BiTrash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogbookListPage;