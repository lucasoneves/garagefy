"use client";

import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { BsPlusLg } from "react-icons/bs";

import MainCard from "@/components/MainCard";
import MaintenanceAlert from "@/components/MaintenanceAlert";
import MonthlySpendings from "@/components/MonthySpendings";
import QuickActions from "@/components/QuickActions";
import { swrFetcher } from "@/lib/api";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  current_odo: number;
  color: string;
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

const DAY_LABELS: Record<number, string> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

const DashboardPage = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("@garagefy:active_vehicle_id");
    if (!savedId) {
      swrFetcher("/vehicles").then((vehicles: Vehicle[]) => {
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

  const { data: vehicles } = useSWR<Vehicle[]>("/vehicles", swrFetcher);
  const { data: fuels } = useSWR<FuelEntry[]>(
    vehicleId ? `/fuels?vehicle_id=${vehicleId}` : null,
    swrFetcher
  );
  const { data: services } = useSWR<Service[]>(
    vehicleId ? `/services?vehicle_id=${vehicleId}` : null,
    swrFetcher
  );

  const activeVehicle = useMemo(
    () => vehicles?.find((v) => v.id === vehicleId) ?? null,
    [vehicles, vehicleId]
  );

  const { totalSpent, weeklyData } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const allCosts: { day: number; cost: number }[] = [];

    (fuels ?? []).forEach((f) => {
      const d = new Date(f.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        allCosts.push({ day: d.getDay(), cost: f.total_cost });
      }
    });

    (services ?? []).forEach((s) => {
      const d = new Date(s.service_date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        allCosts.push({ day: d.getDay(), cost: s.cost });
      }
    });

    const dayTotals: Record<number, number> = {};
    for (let i = 0; i < 7; i++) dayTotals[i] = 0;
    allCosts.forEach(({ day, cost }) => {
      dayTotals[day] = (dayTotals[day] ?? 0) + cost;
    });

    const total = Object.values(dayTotals).reduce((a, b) => a + b, 0);

    const weekData = Object.entries(DAY_LABELS).map(([dayNum, label]) => ({
      day: label,
      value: dayTotals[Number(dayNum)] ?? 0,
    }));

    return { totalSpent: total, weeklyData: weekData };
  }, [fuels, services]);

  const maintenanceMessage = useMemo(() => {
    if (!activeVehicle || !services || services.length === 0) {
      return "No upcoming maintenance";
    }
    const lastService = [...services].sort(
      (a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
    )[0];
    const kmSinceLastService = activeVehicle.current_odo - lastService.current_odo;
    const kmUntilNext = 10000 - kmSinceLastService;

    if (kmUntilNext <= 0) return `Service overdue by ${Math.abs(kmUntilNext)} KM`;
    if (kmUntilNext <= 1000) return `Service needed in ${kmUntilNext} KM`;
    return `Next service in ${kmUntilNext} KM`;
  }, [activeVehicle, services]);

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center pb-24">
        <div className="size-6 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
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
          currentOdometer={activeVehicle.current_odo}
        />
      ) : (
        <section className="bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-8 mb-6 border border-zinc-800/50 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded-lg mb-4" />
          <div className="h-6 bg-zinc-800 rounded-lg w-1/3" />
        </section>
      )}

      {maintenanceMessage && <MaintenanceAlert message={maintenanceMessage} />}

      <MonthlySpendings totalSpent={totalSpent} weeklyData={weeklyData} />

      <QuickActions />

      <button className="fixed bottom-28 right-8 w-16 h-16 bg-[#007BFF] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-95 transition-transform z-20">
        <BsPlusLg size={24} />
      </button>
    </div>
  );
};

export default DashboardPage;
