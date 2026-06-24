"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineCalendar } from "react-icons/hi";
import { LuWaves } from "react-icons/lu";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainSelect from "@/components/ui/MainSelect";

const EditFuelPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [gasStation, setGasStation] = useState("");
  const [fuelType, setFuelType] = useState("gasoline_premium");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [liters, setLiters] = useState("");
  const [currentOdo, setCurrentOdo] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFuelData = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/fuels/${id}`);
        const data = response.data;
        console.log("EditFuel data:", data);

        setGasStation(data.gas_station || "");
        setFuelType(data.fuel_type || "gasoline_premium");
        setPricePerLiter(data.price_per_liter ? String(data.price_per_liter) : "");
        setTotalCost(data.total_cost ? String(data.total_cost) : "");
        setLiters(data.liters ? String(data.liters) : "");
        setCurrentOdo(data.odometer ? String(data.odometer) : "");

        if (data.date) {
          const rawDate = new Date(data.date);
          const day = String(rawDate.getUTCDate()).padStart(2, "0");
          const month = String(rawDate.getUTCMonth() + 1).padStart(2, "0");
          const year = rawDate.getUTCFullYear();
          setDate(`${day}/${month}/${year}`);
        }
      } catch (error: any) {
        console.error("Erro ao buscar abastecimento:", error);
        alert(`Erro ao carregar dados: ${error.message}`);
        router.push("/fuel");
      } finally {
        setLoading(false);
      }
    };

    fetchFuelData();
  }, [id, router]);

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length >= 2) formatted += digits.slice(0, 2) + "/";
    else formatted += digits;
    if (digits.length >= 4) formatted += digits.slice(2, 4) + "/";
    else if (digits.length > 2) formatted += digits.slice(2);
    if (digits.length > 4) formatted += digits.slice(4);
    return formatted;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatDateInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !id) return;

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
        gas_station: gasStation.trim(),
        fuel_type: fuelType,
        price_per_liter: pricePerLiter ? parseFloat(pricePerLiter.replace(",", ".")) : null,
        total_cost: parseFloat(totalCost.replace(",", ".")) || 0,
        liters: liters ? parseFloat(liters.replace(",", ".")) : null,
        odometer: currentOdo ? parseInt(currentOdo, 10) : null,
        date: isoDate,
      };

      await api.put(`/fuels/${id}`, payload);
      router.push("/fuel");
    } catch (error: any) {
      console.error("Erro ao editar abastecimento:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro ao atualizar abastecimento.";
      alert(`Não foi possível salvar: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <p className="text-sm text-zinc-500 animate-pulse">Loading fuel entry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <PageNavHeader pageTitle="Edit Fuel" lastPage="/fuel" />

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
            label="Current Odometer"
            placeholder="0"
            value={currentOdo}
            onChange={(e) => setCurrentOdo(e.target.value)}
            disabled={isSubmitting}
          />
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            KM
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

        <SaveButton title={isSubmitting ? "Updating Fuel Entry..." : "Update Fuel Entry"} />
      </form>
    </div>
  );
};

export default EditFuelPage;
