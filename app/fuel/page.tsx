"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiTrash, BiEdit, BiSolidGasPump } from "react-icons/bi";

import { api, swrFetcher } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";

interface FuelEntry {
  id: string;
  vehicle_id: string;
  gas_station: string;
  fuel_type: string;
  price_per_liter: number;
  total_cost: number;
  liters: number;
  current_odo: number;
  date: string;
}

const fuelTypeLabels: Record<string, string> = {
  gasoline_regular: "Gasolina (Regular)",
  gasoline_premium: "Gasolina (Premium)",
  ethanol: "Etanol",
  diesel: "Diesel",
  cng: "GNV",
};

const FuelPage = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("@garagefy:active_vehicle_id");

    if (!savedId) {
      api.get("/vehicles").then((res) => {
        const vehicles = res.data;
        if (vehicles?.length > 0) {
          const firstId = vehicles[0].id;
          localStorage.setItem("@garagefy:active_vehicle_id", firstId);
          setVehicleId(firstId);
        }
      });
    } else {
      setVehicleId(savedId);
    }
  }, []);

  const { data: entries, error, isLoading, mutate } = useSWR<FuelEntry[]>(
    vehicleId ? `/fuels?vehicle_id=${vehicleId}` : null,
    swrFetcher
  );



  const totalSpent = entries?.reduce((acc, entry) => acc + entry.total_cost, 0) || 0;
  const totalLiters = entries?.reduce((acc, entry) => acc + entry.liters, 0) || 0;

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este abastecimento?")) return;

    try {
      await api.delete(`/fuels/${id}`);
      mutate();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar o registro.");
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
      <PageNavHeader pageTitle="Fuel History" />

      <main className="mt-6 space-y-6">
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900/80 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Gasto</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">
              R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {totalLiters.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} L total
            </p>
          </div>
          <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 border border-zinc-800/40">
            <BiSolidGasPump size={24} />
          </div>
        </div>

        {isLoading && <div className="text-center text-zinc-500 py-8 animate-pulse text-sm">Carregando histórico...</div>}
        {error && <div className="text-center text-red-400 py-8 text-sm">Erro ao conectar com o servidor.</div>}

        {!isLoading && !error && (
          <div className="space-y-4">
            {entries?.map((entry) => {
              const formattedDate = new Date(entry.date).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              });

              return (
                <div key={entry.id} className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {formattedDate} • {entry.current_odo.toLocaleString("pt-BR")} km
                      </span>
                      <h4 className="text-xl font-bold tracking-tight">{entry.gas_station}</h4>
                      <p className="text-xs text-zinc-400 font-medium">
                        {fuelTypeLabels[entry.fuel_type] || entry.fuel_type}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/fuel/edit/${entry.id}`}
                        className="text-zinc-500 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-500/5 transition-all"
                      >
                        <BiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 transition-all"
                      >
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-900/60 grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Litros</span>
                      <p className="text-base font-bold text-zinc-200 mt-0.5">
                        {entry.liters.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} L
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preço/L</span>
                      <p className="text-base font-bold text-zinc-200 mt-0.5">
                        R$ {entry.price_per_liter.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
                      <p className="text-base font-bold text-zinc-200 mt-0.5">
                        R$ {entry.total_cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {entries?.length === 0 && (
              <div className="text-center text-zinc-600 py-12 text-sm font-medium">
                Nenhum abastecimento registrado para este veículo ainda.
              </div>
            )}

            <Link
              href="/add-fuel"
              className="sticky bottom-25 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-sm shadow-2xl border-2 border-dashed border-zinc-800/80 rounded-[2rem] py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.99]"
            >
              <IoAddCircleOutline size={28} />
              <span className="font-bold text-xs uppercase tracking-widest">Add Fuel</span>
            </Link>
          </div>
        )}
      </main>

    </div>
  );
};

export default FuelPage;
