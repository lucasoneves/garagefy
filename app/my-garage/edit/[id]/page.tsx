"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";

const EditVehiclePage = () => {
  const router = useRouter();
  const { id } = useParams(); // Captura dinamicamente o UUID do veículo vindo da URL da rota

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [currentOdo, setCurrentOdo] = useState("");
  const [color, setColor] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Busca os dados existentes do veículo no banco para preencher os inputs
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!id) return;
      
      try {
        const response = await api.get(`/vehicles/${id}`);
        const data = response.data;
        
        setBrand(data.brand || "");
        setModel(data.model || "");
        setYear(data.year ? String(data.year) : "");
        setPlate(data.plate || "");
        setCurrentOdo(data.current_odo ? String(data.current_odo) : "");
        setColor(data.color && data.color !== "N/A" ? data.color : "");
      } catch (error: any) {
        console.error("Erro ao carregar dados do veículo:", error);
        alert(`Erro ao carregar dados: ${error.message}`);
        router.push("/my-garage");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id, router]);

  // 2. Envia os dados modificados usando PUT em formato JSON puro para o Go
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !id) return;

    setIsSubmitting(true);

    try {
      // Payload limpo estruturado exatamente com o formato do UpdateVehicle do Go
      const payload = {
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year, 10) || 0,
        plate: plate.trim().toUpperCase(),
        current_odo: parseInt(currentOdo, 10) || 0,
        color: color.trim() || "N/A",
      };

      await api.put(`/vehicles/${id}`, payload);

      router.push("/my-garage");
    } catch (error: any) {
      console.error("Erro na atualização do veículo:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro desconhecido ao atualizar no servidor.";
      alert(`Não foi possível atualizar o veículo: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trava a interface enquanto busca as informações originais do banco
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center">
        <p className="text-sm text-zinc-500 text-center animate-pulse">
          Loading vehicle data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Edit Vehicle" lastPage="/my-garage" />

      <form onSubmit={handleSubmit} className="space-y-6 pb-40">
        {/* Brand/Make */}
        <MainInput
          label="Make / Brand"
          type="text"
          placeholder="e.g. BMW"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          disabled={isSubmitting}
        />

        {/* Model */}
        <MainInput
          label="Model"
          type="text"
          placeholder="e.g. M4 Competition"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          disabled={isSubmitting}
        />

        {/* Year and License Plate */}
        <div className="space-y-2 w-full flex gap-4 justify-between">
          <MainInput
            label="Year"
            type="text"
            placeholder="2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <MainInput
            label="License Plate"
            type="text"
            placeholder="ABC1234"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Color & Odometer */}
        <div className="space-y-2 w-full flex gap-4 justify-between items-start">
          <div className="flex-1">
            <MainInput
              label="Color"
              type="text"
              placeholder="e.g. Black"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex-1 relative">
            <MainInput
              label="Current Odometer"
              type="number"
              placeholder="0"
              value={currentOdo}
              onChange={(e) => setCurrentOdo(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
              KM
            </span>
          </div>
        </div>

        <SaveButton title={isSubmitting ? "Updating Vehicle..." : "Update Vehicle"} />
      </form>
    </div>
  );
};

export default EditVehiclePage;