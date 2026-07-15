"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiTrash, BiEdit, BiWrench } from "react-icons/bi";

import { api, swrFetcher } from "@/lib/api";
import { Service, SERVICE_TYPE_LABELS, SERVICE_TYPE_BADGE_CLASSES } from "@/lib/types";
import PageNavHeader from "@/components/PageNavHeader";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  current_odo: number;
  color: string;
}

const VehicleServicesPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: vehicle, error: vehicleError, isLoading: vehicleLoading } = useSWR<Vehicle>(
    id ? `/vehicles/${id}` : null,
    swrFetcher
  );

  const { data: services, error: servicesError, isLoading: servicesLoading, mutate } = useSWR<Service[]>(
    id ? `/services?vehicle_id=${id}` : null,
    swrFetcher
  );

  const totalSpent = services?.reduce((acc, service) => acc + service.cost, 0) || 0;

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Deseja realmente excluir o registro deste serviço?")) return;

    try {
      await api.delete(`/services/${serviceId}`);
      mutate();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar o serviço do servidor.");
    }
  };

  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <p className="text-zinc-500 text-sm animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (vehicleError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <p className="text-zinc-400 text-center mb-4">Veículo não encontrado.</p>
        <Link href="/my-garage" className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
          Voltar para a Garagem
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans">
      <PageNavHeader
        pageTitle={vehicle ? `${vehicle.brand} ${vehicle.model}` : "Serviços"}
        lastPage="/my-garage"
      />

      <main className="mt-6 space-y-6">
        <div className="bg-[#121212] rounded-[2rem] p-6 border border-zinc-900/80 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Investido</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">
              R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 border border-zinc-800/40">
            <BiWrench size={24} />
          </div>
        </div>

        {servicesLoading && <div className="text-center text-zinc-500 py-8 animate-pulse text-sm">Carregando histórico...</div>}
        {servicesError && <div className="text-center text-red-400 py-8 text-sm">Erro ao conectar com o servidor.</div>}

        {!servicesLoading && !servicesError && (
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xl font-bold tracking-tight">{service.title}</h4>
                        {service.service_type && (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${SERVICE_TYPE_BADGE_CLASSES[service.service_type]}`}>
                            {SERVICE_TYPE_LABELS[service.service_type]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">{service.shop_name}</p>
                    </div>

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
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Custo</span>
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

            <Link
              href={`/services/add`}
              className="sticky bottom-25 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-sm shadow-2xl border-2 border-dashed border-zinc-800/80 rounded-[2rem] py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.99]"
            >
              <IoAddCircleOutline size={28} />
              <span className="font-bold text-xs uppercase tracking-widest">Novo Serviço</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default VehicleServicesPage;
