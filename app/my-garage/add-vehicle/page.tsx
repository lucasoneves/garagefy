"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";

const AddVehiclePage = () => {
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [currentOdo, setCurrentOdo] = useState("");
  const [color, setColor] = useState(""); // Adicionado campo de cor opcional que seu Go aceita
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Monta o payload exatamente com o formato e os tipos primitivos que o c.ShouldBindJSON exige
      const payload = {
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year, 10) || 0,
        plate: plate.trim().toUpperCase(),
        current_odo: parseInt(currentOdo, 10) || 0,
        color: color.trim() || "N/A", // Evita passar nulo se não preenchido
      };

      const res = await api.post("/vehicles", payload);
      localStorage.setItem("@garagefy:active_vehicle_id", res.data.id);

      router.push("/my-garage");
    } catch (error: any) {
      console.error("Erro no cadastro do veículo:", error);
      const serverMessage = error.response?.data?.error || error.message || "Erro desconhecido no servidor.";
      alert(`Não foi possível cadastrar: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="Add Vehicle" lastPage="/my-garage" />

      <form onSubmit={handleSubmit} className="space-y-6 pb-40 mt-6 px-4">
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
        <div className="space-y-2 w-full flex gap-4 justify-between items-end">
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

        <SaveButton title={isSubmitting ? "Adding to Garage..." : "Add to My Garage"} />
      </form>
    </div>
  );
};

export default AddVehiclePage;