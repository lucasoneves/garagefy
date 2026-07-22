"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { BsPlusLg } from "react-icons/bs";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import MainCard from "@/components/MainCard";
import MaintenanceAlert from "@/components/MaintenanceAlert";
import RecentOccurrences, { Occurrence } from "@/components/RecentOccurrences";
import QuickActions from "@/components/QuickActions";
import { swrFetcher } from "@/lib/api";
import { Service } from "@/lib/types";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  current_odo: number;
  color: string;
  renavam?: string;
  created_at?: string;
}

interface FuelEntry {
  id: string;
  vehicle_id: string;
  gas_station: string;
  fuel_type: string;
  price_per_liter: number;
  total_cost: number;
  liters: number;
  odometer: number;
  date: string;
}

interface LogbookEntry {
  id: string;
  vehicle_id: string;
  category: "Observation" | "Reminder" | "To-do";
  title: string;
  description: string;
  created_at: string;
}

const DashboardPage = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  const { data: vehicles, isLoading: vehiclesLoading } = useSWR<Vehicle[]>("/vehicles", swrFetcher);

  useEffect(() => {
    if (!vehicles) return;

    const savedId = localStorage.getItem("@garagefy:active_vehicle_id");
    const savedExists = vehicles.some((v) => v.id === savedId);

    if (savedExists) {
      setVehicleId(savedId);
    } else if (vehicles.length > 0) {
      const firstId = vehicles[0].id;
      localStorage.setItem("@garagefy:active_vehicle_id", firstId);
      setVehicleId(firstId);
    }
  }, [vehicles]);

  const { data: fuels } = useSWR<FuelEntry[]>(
    vehicleId ? `/fuels?vehicle_id=${vehicleId}` : null,
    swrFetcher
  );
  const { data: services } = useSWR<Service[]>(
    vehicleId ? `/services?vehicle_id=${vehicleId}` : null,
    swrFetcher
  );
  const { data: logbookEntries } = useSWR<LogbookEntry[]>(
    vehicleId ? `/vehicles/${vehicleId}/logbook` : null,
    swrFetcher
  );

  const activeVehicle = useMemo(
    () => vehicles?.find((v) => v.id === vehicleId) ?? null,
    [vehicles, vehicleId]
  );

  const recentOccurrences: Occurrence[] = useMemo(() => {
    const serviceOccs: Occurrence[] = (services ?? []).map((s) => ({
      id: s.id,
      type: "service" as const,
      title: s.title,
      date: s.service_date,
      cost: s.cost,
      editUrl: `/services/edit/${s.id}`,
    }));

    const fuelOccs: Occurrence[] = (fuels ?? []).map((f) => ({
      id: f.id,
      type: "fuel" as const,
      title: `${f.gas_station} — ${f.fuel_type}`,
      date: f.date,
      cost: f.total_cost,
      editUrl: `/fuel/edit/${f.id}`,
    }));

    const logbookOccs: Occurrence[] = (logbookEntries ?? []).map((e) => ({
      id: e.id,
      type: "logbook" as const,
      title: e.title,
      date: e.created_at,
      cost: null,
      editUrl: `/logbook/edit/${e.id}`,
    }));

    return [...serviceOccs, ...fuelOccs, ...logbookOccs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [fuels, services, logbookEntries]);

  const maintenanceMessage = useMemo(() => {
    if (!activeVehicle || !services || services.length === 0) {
      return "Nenhuma manutenção prevista";
    }
    const lastService = [...services].sort(
      (a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
    )[0];
    const kmSinceLastService = activeVehicle.current_odo - lastService.current_odo;
    const kmUntilNext = 10000 - kmSinceLastService;

    if (kmUntilNext <= 0) return `Manutenção atrasada em ${Math.abs(kmUntilNext)} KM`;
    if (kmUntilNext <= 1000) return `Manutenção necessária em ${kmUntilNext} KM`;
    return `Próxima manutenção em ${kmUntilNext} KM`;
  }, [activeVehicle, services]);

  if (vehiclesLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center pb-24">
        <div className="size-6 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (vehicles && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 pb-24">
        <HiOutlineExclamationTriangle className="text-amber-500 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-center mb-2">
          Nenhum veículo encontrado
        </h2>
        <p className="text-zinc-400 text-center mb-8 max-w-sm">
          Você ainda não possui nenhum veículo cadastrado. Adicione o seu primeiro veículo para começar a usar o Garagefy.
        </p>
        <Link
          href="/my-garage/add-vehicle"
          className="px-8 py-3 bg-[#007BFF] rounded-full text-white font-medium active:scale-95 transition-transform"
        >
          Adicionar veículo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans">
      {activeVehicle ? (
        <MainCard
          vehicleId={activeVehicle.id}
          brand={activeVehicle.brand}
          model={activeVehicle.model}
          year={activeVehicle.year}
          plate={activeVehicle.plate}
          currentOdometer={activeVehicle.current_odo}
        />
      ) : (
        <section className="bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-8 mb-6 border border-zinc-800/50 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded-lg mb-4" />
          <div className="h-6 bg-zinc-800 rounded-lg w-1/3" />
        </section>
      )}

      {maintenanceMessage && <MaintenanceAlert message={maintenanceMessage} />}

      <RecentOccurrences occurrences={recentOccurrences} />

      <QuickActions />

      <button className="fixed bottom-28 right-8 w-16 h-16 bg-[#007BFF] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-95 transition-transform z-20">
        <BsPlusLg size={24} />
      </button>
    </div>
  );
};

export default DashboardPage;
