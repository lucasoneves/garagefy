"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BiPlus, BiTrash, BiFile, BiTimeFive } from "react-icons/bi";
import PageNavHeader from "@/components/PageNavHeader";
import PageDescription from "@/components/ui/PageDescription";
import FilterTab, { FilterOption } from "@/components/ui/FilterTab";

interface LogbookEntry {
  id: string;
  vehicle_id: string;
  category: "Observation" | "Reminder" | "To-do";
  title: string;
  description: string;
  attachment_url?: string;
  created_at: string;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Entries" },
  { value: "Observation", label: "Observations" },
  { value: "Reminder", label: "Reminders" },
  { value: "To-do", label: "To-dos" },
];

const MOCK_VEHICLE_ID = "c303282d-f2e6-48ec-a34d-16be2e68407a";

const LogbookListPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados na API em Go aplicando o query param do FilterTab
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/vehicles/${MOCK_VEHICLE_ID}/logbook?category=${activeFilter}`,
      );
      if (!response.ok) throw new Error("Erro ao carregar registros");
      const data = await response.json();
      setEntries(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // Carrega ou recarrega sempre que o filtro ativo mudar
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Função para Deletar um registro (DELETE)
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta entrada?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/vehicles/${MOCK_VEHICLE_ID}/logbook/${id}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        // Atualiza o estado local removendo o item sem precisar recarregar a página inteira
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      } else {
        alert("Erro ao deletar o registro.");
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
    }
  };

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
        {loading ? (
          <p className="text-sm text-zinc-500 font-medium text-center py-10">
            Loading entries...
          </p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-zinc-500 font-medium text-center py-10">
            No entries found for this category.
          </p>
        ) : (
          entries.map((entry) => (
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
              <div className="space-y-1 pr-10">
                <h3 className="text-sm font-bold text-zinc-200">
                  {entry.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {entry.description}
                </p>
              </div>

              {/* Footer Card: Thumbnail de Anexo e Ações */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900/40">
                {entry.attachment_url ? (
                  <a
                    href={`http://localhost:8080${entry.attachment_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <BiFile size={16} />
                    <span>View attachment</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-zinc-600 italic">
                    No attachments
                  </span>
                )}

                {/* Botão de Exclusão */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all"
                    title="Delete entry"
                  >
                    <BiTrash size={16} />
                  </button>
                  <Link
                    href={`/logbook/edit/${entry.id}`}
                    className="text-zinc-500 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-500/5 border border-transparent hover:border-blue-500/10 transition-all text-xs font-bold"
                    title="Edit entry"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogbookListPage;
