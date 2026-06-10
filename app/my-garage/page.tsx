'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BiTrash, BiEdit } from 'react-icons/bi';

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
  const router = useRouter();
  
  // Hook do SWR para buscar os veículos em tempo real
  const { data: vehicles, error, isLoading, mutate } = useSWR<Vehicle[]>(
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

  // Lógica para Deletar o Veículo se comunicando diretamente com o DeleteVehicle do Go
  const handleDeleteVehicle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique dispare ações do card pai
    
    if (!confirm('Tem certeza que deseja remover este veículo de sua garagem?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Se o carro excluído for o ativo, limpa o estado e o localStorage
        if (id === activeVehicleId) {
          setActiveVehicleId(null);
          localStorage.removeItem('@garagefy:active_vehicle_id');
        }
        // Atualiza o cache do SWR instantaneamente
        mutate();
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.error || 'Erro ao remover o veículo do servidor.');
      }
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      alert('Não foi possível conectar ao servidor para excluir o veículo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans selection:bg-blue-500/30">
      
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
        <section className="space-y-4 mt-6">
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
                {/* Cabeçalho do Card: Badge e Botões de Ação */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {isActive ? (
                      <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block bg-zinc-900 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest border border-zinc-800/40">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Grupo de Ações: Editar e Excluir */}
                  <div className="flex items-center gap-1.5 z-10">
                    <Link
                      href={`/my-garage/edit/${vehicle.id}`}
                      className="text-zinc-500 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-500/5 border border-transparent hover:border-blue-500/10 transition-all"
                      title="Edit vehicle details"
                    >
                      <BiEdit size={18} />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteVehicle(vehicle.id, e)}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all"
                      title="Delete vehicle"
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                </div>

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

                    {/* Meta informações discretas (Ano, Placa e Cor opcional se cadastrada) */}
                    <div className="text-xs text-zinc-500 font-medium flex flex-wrap gap-3">
                      <span>Ano: {vehicle.year}</span>
                      <span>•</span>
                      <span className="uppercase">Placa: {vehicle.plate}</span>
                      {vehicle.color && vehicle.color !== "N/A" && (
                        <>
                          <span>•</span>
                          <span className="capitalize">Cor: {vehicle.color}</span>
                        </>
                      )}
                    </div>

                    {/* Botão de ativação ou Link para ir direto ao Logbook do carro */}
                    <div className="pt-2 border-t border-zinc-900/40">
                      {isActive ? (
                        <Link
                          href="/logbook"
                          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Ver Logbook <span>→</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleSetActive(vehicle.id)}
                          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Set Active <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Estado de Garagem Vazia */}
          {vehicles?.length === 0 && (
            <div className="py-12 text-center text-zinc-600 text-sm font-medium">
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