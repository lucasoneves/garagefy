'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { IoAddCircleOutline } from 'react-icons/io5';

import BottomNav from '@/components/BottomNav';
import PageNavHeader from '@/components/PageNavHeader';

// Interface baseada no modelo que validamos no Postman
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  current_odo: number;
  color: string;
}

// Fetcher padrão para o SWR consumir a API do Docker
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Falha ao buscar dados da API');
  return res.json();
});

const MyGaragePage = () => {
  // Hook do SWR para buscar os veículos em tempo real
  const { data: vehicles, error, isLoading } = useSWR<Vehicle[]>(
    'http://localhost:8080/api/vehicles',
    fetcher
  );

  // Estado para controlar qual ID de veículo está ativo (salvo no navegador)
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);

  // Carrega o veículo ativo inicial do localStorage assim que a página monta
  useEffect(() => {
    const savedActiveId = localStorage.getItem('@garagefy:active_vehicle_id');
    setActiveVehicleId(savedActiveId);
  }, []);

  // Define um novo veículo ativo e persiste a escolha no localStorage
  const handleSetActive = (id: string) => {
    setActiveVehicleId(id);
    localStorage.setItem('@garagefy:active_vehicle_id', id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans px-4">
      
      {/* Header */}
      <PageNavHeader pageTitle="My Garage" />

      {/* Estados de Carregamento e Erro da API */}
      {isLoading && (
        <div className="py-12 text-center text-zinc-500 font-medium text-sm animate-pulse">
          Carregando sua garagem...
        </div>
      )}

      {error && (
        <div className="py-12 text-center text-red-400 font-medium text-sm">
          Não foi possível conectar à API. Verifique se o Docker está rodando.
        </div>
      )}

      {/* Lista de Veículos Dinâmica */}
      {!isLoading && !error && (
        <section className="space-y-4">
          {vehicles?.map((vehicle) => {
            // Verifica se este item é o atual ativo
            const isActive = vehicle.id === activeVehicleId;

            return (
              <div
                key={vehicle.id}
                className={`bg-[#121212] rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300 border ${
                  isActive
                    ? 'border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20'
                    : 'border-zinc-900'
                }`}
              >
                {/* Badge de Ativo */}
                {isActive && (
                  <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest mb-3">
                    Active
                  </span>
                )}

                {/* Corpo do Card */}
                <div className="flex justify-between items-start">
                  <div className="space-y-4 w-full">
                    <div className="flex gap-4 items-baseline justify-between">
                      <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        {vehicle.brand} {vehicle.model}
                      </h2>
                      <p className="text-sm text-zinc-400 font-semibold whitespace-nowrap">
                        {vehicle.current_odo.toLocaleString('pt-BR')} km
                      </p>
                    </div>

                    {/* Meta informações discretas (Ano e Placa) */}
                    <div className="text-xs text-zinc-500 font-medium flex gap-3">
                      <span>Ano: {vehicle.year}</span>
                      <span>•</span>
                      <span className="uppercase">Placa: {vehicle.plate}</span>
                    </div>

                    {/* Botão de ativação ou Link para ir direto ao Logbook do carro */}
                    {isActive ? (
                      <Link
                        href="/logbook"
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
                      >
                        Ver Logbook <span>→</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSetActive(vehicle.id)}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors mt-2"
                      >
                        Set Active <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Estado de Garagem Vazia */}
          {vehicles?.length === 0 && (
            <div className="py-8 text-center text-zinc-600 text-sm">
              Nenhum veículo cadastrado na sua conta ainda.
            </div>
          )}

          {/* Botão tracejado "Add New Vehicle" */}
          <Link
            href="/my-garage/add-vehicle"
            className="w-full border-2 border-dashed border-zinc-800/80 rounded-[2rem] py-8 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.99]"
          >
            <IoAddCircleOutline size={28} />
            <span className="font-bold text-xs uppercase tracking-widest">
              Add New Vehicle
            </span>
          </Link>
        </section>
      )}

      <BottomNav />
    </div>
  );
};

export default MyGaragePage;