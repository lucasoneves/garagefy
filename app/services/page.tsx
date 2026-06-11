"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiTrash, BiEdit, BiWrench } from "react-icons/bi";

import BottomNav from "@/components/BottomNav";
import PageNavHeader from "@/components/PageNavHeader";

interface Service {
  id: string;
  vehicle_id: string;
  title: string;
  description: string;
  shop_name: string;
  current_odo: number;
  cost: number;
  service_date: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Falha ao buscar serviços");
  return res.json();
});

const ServicesPage = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("@garagefy:active_vehicle_id");
    const tempTimeout = setTimeout(() => {
      setVehicleId(savedId);
    }, 0);

    return () => clearTimeout(tempTimeout);
  }, []);

  // Só dispara o SWR se o vehicleId já tiver sido carregado do localStorage
  const { data: services, error, isLoading, mutate } = useSWR<Service[]>(
    vehicleId ? `http://localhost:8080/api/services?vehicle_id=${vehicleId}` : null,
    fetcher
  );

  // Calcula o total acumulado gasto em serviços neste veículo
  const totalSpent = services?.reduce((acc, service) => acc + service.cost, 0) || 0;

  const handleDeleteService = async (id: string) => {
    if (!confirm("Deseja realmente excluir o registro deste serviço?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate(); // Atualiza a lista instantaneamente
      } else {
        alert("Erro ao deletar o serviço do servidor.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao tentar deletar.");
    }
  };

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <p className="text-zinc-400 text-center mb-4">Nenhum veículo ativo selecionado.</p>
        <Link href="/my-garage" className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
          Ir para a Garagem
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans">
      <PageNavHeader pageTitle="Services Log" />

      <main className="mt-6 space-y-6">
        {/* Card de Sumário de Gastos */}
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900/80 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Invested</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">
              R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 border border-zinc-800/40">
            <BiWrench size={24} />
          </div>
        </div>

        {/* Estados da API */}
        {isLoading && <div className="text-center text-zinc-500 py-8 animate-pulse text-sm">Carregando histórico...</div>}
        {error && <div className="text-center text-red-400 py-8 text-sm">Erro ao conectar com o servidor.</div>}

        {/* Lista de Cards de Serviço */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {services?.map((service) => {
              const formattedDate = new Date(service.service_date).toLocaleDateString("pt-BR", {
                timeZone: "UTC"
              });

              return (
                <div key={service.id} className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {formattedDate} • {service.current_odo.toLocaleString("pt-BR")} km
                      </span>
                      <h4 className="text-xl font-bold tracking-tight">{service.title}</h4>
                      <p className="text-xs text-zinc-400 font-medium">{service.shop_name}</p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/services/edit/${service.id}`}
                        className="text-zinc-500 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-500/5 transition-all"
                      >
                        <BiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 transition-all"
                      >
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {service.description && (
                    <p className="mt-4 text-xs text-zinc-500 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/40">
                      {service.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-zinc-900/60 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cost</span>
                    <span className="text-lg font-bold text-zinc-200">
                      R$ {service.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}

            {services?.length === 0 && (
              <div className="text-center text-zinc-600 py-12 text-sm font-medium">
                Nenhum serviço registrado para este veículo ainda.
              </div>
            )}

            {/* Botão Refatorado para Sticky com 100px de distância do bottom */}
            <Link
              href="/services/add"
              className="sticky bottom-25 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-sm shadow-2xl border-2 border-dashed border-zinc-800/80 rounded-[2rem] py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.99]"
            >
              <IoAddCircleOutline size={28} />
              <span className="font-bold text-xs uppercase tracking-widest">Add New Service</span>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ServicesPage;