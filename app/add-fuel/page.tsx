"use client";

import React, { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import { LuWaves } from "react-icons/lu";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainSelect from "@/components/ui/MainSelect";

const AddFuelPage = () => {
  const [date, setDate] = useState("10/27/2023");

  // Máscara simples para data (DD/MM/YYYY)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setDate(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para salvar os dados no backend
    console.log({ date });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <PageNavHeader pageTitle="Add Fuel" />

      {/* Engatilhando o onSubmit direto no form usando o comportamento nativo */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-40 mt-6">
        
        {/* Gas Station */}
        <MainInput
          label="Gas Station"
          placeholder="Shell, Exxon, BP..."
          required
        />

        {/* Fuel Type - Refatorado para usar o componente MainSelect */}
        <MainSelect
          label="Fuel Type"
          icon={LuWaves}
          defaultValue="gasoline_premium"
        >
          <option value="gasoline_regular">Gasoline (Regular)</option>
          <option value="gasoline_premium">Gasoline (Premium)</option>
          <option value="ethanol">Ethanol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG (Natural Gas)</option>
        </MainSelect>

        {/* Grid de Custos */}
        <div className="space-y-2 w-full flex gap-4 justify-between">
          <MainInput
            label="Price / L"
            placeholder="0.00"
            required
          />
          <MainInput
            label="Total Cost"
            placeholder="0.00"
            required
          />
        </div>

        {/* Liters */}
        <div className="space-y-2 w-full relative">
          <MainInput
            label="Liters"
            placeholder="0.00"
            required
          />
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            L
          </span>
        </div>

        {/* Odometer */}
        <div className="space-y-2 w-full relative">
          <MainInput
            label="Current Odometer"
            placeholder="45,230"
            required
          />
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            KM
          </span>
        </div>

        <div className="space-y-2 w-full relative">
          <MainInput
            label="Date"
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
          />
          <span className="absolute bottom-4 right-5 text-zinc-600 pointer-events-none">
            <HiOutlineCalendar size={20} />
          </span>
        </div>

        <SaveButton title="Save Fuel Entry" />
      </form>
    </div>
  );
};

export default AddFuelPage;