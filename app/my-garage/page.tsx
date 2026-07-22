'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BiTrash, BiEdit } from 'react-icons/bi';

import { api } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import PageNavHeader from '@/components/PageNavHeader';
import VehicleCardSkeleton from '@/components/VehicleCardSkeleton';
import VehicleSearchAndFilters from '@/components/VehicleSearchAndFilters';

const LIMIT = 20;

const MyGaragePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    total_pages: number;
    has_next: boolean;
  } | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef(search);
  filtersRef.current = search;

  useEffect(() => {
    const savedActiveId = localStorage.getItem('@garagefy:active_vehicle_id');
    setActiveVehicleId(savedActiveId);
  }, []);

  const fetchVehicles = async (pageNum: number, append = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const f = filtersRef.current;
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    params.set('limit', String(LIMIT));
    if (f) params.set('search', f);

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      const res = await api.get(`/vehicles?${params.toString()}`, {
        signal: controller.signal,
      });

      const body = res.data;

      let items: Vehicle[];
      let meta: { total: number; total_pages: number; has_next: boolean };

      if (Array.isArray(body)) {
        items = body;
        meta = { total: body.length, total_pages: 1, has_next: false };
      } else {
        items = body.data ?? [];
        meta = {
          total: body.pagination?.total ?? items.length,
          total_pages: body.pagination?.total_pages ?? 1,
          has_next: body.pagination?.has_next ?? false,
        };
      }

      setVehicles((prev) => (append ? [...prev, ...items] : items));
      setPagination({
        total: meta.total,
        total_pages: meta.total_pages,
        has_next: meta.has_next,
      });
      setError(null);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError('Não foi possível conectar à API. Verifique se o Docker está rodando.');
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVehicles(1, false);
  }, [search]);

  useEffect(() => {
    if (!observerRef.current || !pagination?.has_next) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && pagination?.has_next) {
          const nextPage = Math.ceil(vehicles.length / LIMIT) + 1;
          fetchVehicles(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [pagination?.has_next, isLoadingMore, vehicles.length]);

  useEffect(() => {
    if (vehicles.length > 0 && !activeVehicleId) {
      const sorted = [...vehicles].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
      const lastVehicle = sorted[0];
      setActiveVehicleId(lastVehicle.id);
      localStorage.setItem('@garagefy:active_vehicle_id', lastVehicle.id);
    }
  }, [vehicles, activeVehicleId]);

  const handleSetActive = (id: string) => {
    setActiveVehicleId(id);
    localStorage.setItem('@garagefy:active_vehicle_id', id);
  };

  const handleDeleteVehicle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Tem certeza que deseja remover este veículo de sua garagem?')) return;

    try {
      await api.delete(`/vehicles/${id}`);

      if (id === activeVehicleId) {
        setActiveVehicleId(null);
        localStorage.removeItem('@garagefy:active_vehicle_id');
      }

      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : null));
    } catch (error: any) {
      console.error('Erro ao deletar veículo:', error);
      const errorMessage = error.response?.data?.error || 'Não foi possível conectar ao servidor para excluir o veículo.';
      alert(errorMessage);
    }
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a.id === activeVehicleId) return -1;
    if (b.id === activeVehicleId) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="My Garage" />

      {/* Search + Filters */}
      <div className="mt-4">
        <VehicleSearchAndFilters
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Contador de resultados */}
      {pagination && !isInitialLoading && (
        <div className="mt-4">
          <p className="text-xs text-zinc-600 font-medium">
            {pagination.total} {pagination.total === 1 ? 'veículo' : 'veículos'} encontrado{pagination.total === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {/* Loading inicial */}
      {isInitialLoading && (
        <section className="space-y-4 mt-6">
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
        </section>
      )}

      {/* Erro */}
      {error && (
        <div className="py-12 text-center text-red-400 font-medium text-sm">
          {error}
        </div>
      )}

      {/* Lista de Veículos */}
      {!isInitialLoading && !error && (
        <section className="space-y-4 mt-6">
          {sortedVehicles.map((vehicle) => {
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
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {isActive ? (
                      <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
                        Selected
                      </span>
                    ) : (
                      <span className="inline-block bg-zinc-900 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest border border-zinc-800/40">
                        Not Selected
                      </span>
                    )}
                  </div>

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

                    <div className="text-xs text-zinc-500 font-medium flex flex-wrap gap-3">
                      <span>Ano: {vehicle.year}</span>
                      <span>•</span>
                      <span className="uppercase">Placa: {vehicle.plate}</span>
                      {vehicle.color && vehicle.color !== 'N/A' && (
                        <>
                          <span>•</span>
                          <span className="capitalize">Cor: {vehicle.color}</span>
                        </>
                      )}
                    </div>

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
          {vehicles.length === 0 && !isInitialLoading && (
            <div className="py-12 text-center text-zinc-600 text-sm font-medium">
              {search
                ? 'Nenhum veículo encontrado com os filtros aplicados.'
                : 'Nenhum veículo cadastrado na sua conta ainda.'}
            </div>
          )}

          {/* Sentinel para scroll loading */}
          {pagination?.has_next && (
            <div ref={observerRef} className="py-4">
              {isLoadingMore && (
                <div className="space-y-4">
                  <VehicleCardSkeleton />
                </div>
              )}
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
    </div>
  );
};

export default MyGaragePage;
