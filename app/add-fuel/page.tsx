"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCalendar } from "react-icons/hi";
import { LuWaves } from "react-icons/lu";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainSelect from "@/components/ui/MainSelect";

const AddFuelPage = () => {
  const router = useRouter();

  const [gasStation, setGasStation] = useState("");
  const [fuelType, setFuelType] = useState("gasoline_premium");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [liters, setLiters] = useState("");
  const [date, setDate] = useState("");

  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";

    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + "/";
    } else {
      formatted += digits;
    }

    if (digits.length >= 4) {
      formatted += digits.slice(2, 4) + "/";
    } else if (digits.length > 2) {
      formatted += digits.slice(2);
    }

    if (digits.length > 4) {
      formatted += digits.slice(4);
    }

    return formatted;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatDateInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !vehicleId) return;

    setIsSubmitting(true);

    try {
      let isoDate = new Date().toISOString();
      if (date.length === 10) {
        const [day, month, year] = date.split("/");
        const parsedDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        if (!isNaN(parsedDate.getTime())) {
          isoDate = parsedDate.toISOString();
        }
      }

      const payload = {
        vehicle_id: vehicleId,
        gas_station: gasStation.trim(),
        fuel_type: fuelType,
        price_per_liter: pricePerLiter ? parseFloat(pricePerLiter.replace(",", ".")) : null,
        total_cost: parseFloat(totalCost.replace(",", ".")) || 0,
        liters: liters ? parseFloat(liters.replace(",", ".")) : null,
        date: isoDate,
      };

      await api.post("/fuels", payload);
      router.push("/fuel");
    } catch (error: any) {
      console.error("Erro ao cadastrar abastecimento:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro desconhecido.";
      alert(`Não foi possível salvar: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <PageNavHeader pageTitle="Add Fuel" />

      <form onSubmit={handleSubmit} className="space-y-6 pb-40 mt-6">

        <MainInput
          label="Gas Station"
          placeholder="Shell, Exxon, BP..."
          value={gasStation}
          onChange={(e) => setGasStation(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <MainSelect
          label="Fuel Type"
          icon={LuWaves}
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <option value="gasoline_regular">Gasoline (Regular)</option>
          <option value="gasoline_premium">Gasoline (Premium)</option>
          <option value="ethanol">Ethanol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG (Natural Gas)</option>
        </MainSelect>

        <div className="space-y-2 w-full flex gap-4 justify-between">
          <MainInput
            label="Price / L"
            placeholder="0.00"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(e.target.value)}
            disabled={isSubmitting}
          />
          <MainInput
            label="Total Cost"
            placeholder="0.00"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2 w-full relative">
          <MainInput
            label="Liters"
            placeholder="0.00"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            disabled={isSubmitting}
          />
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            L
          </span>
        </div>

        <div className="space-y-2 w-full relative">
          <MainInput
            label="Date"
            type="text"
            value={date}
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
            disabled={isSubmitting}
          />
          <span className="absolute bottom-4 right-5 text-zinc-600 pointer-events-none">
            <HiOutlineCalendar size={20} />
          </span>
        </div>

        <SaveButton title={isSubmitting ? "Saving Fuel Entry..." : "Save Fuel Entry"} />
      </form>
    </div>
  );
};

export default AddFuelPage;
