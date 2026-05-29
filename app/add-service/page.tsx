"use client";

import React, { useState } from "react";
import { HiOutlineCalendar, HiOutlineInformationCircle } from "react-icons/hi";
import { MdOutlineStorefront, MdOutlineSpeed } from "react-icons/md";
import { FiTool } from "react-icons/fi";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";
import MainTextArea from "@/components/ui/MainTextArea";

const AddServicePage = () => {
  const [date, setDate] = useState<string>("");

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8); // MMDDYYYY
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para enviar o payload de serviço para a API do Garagefy
    console.log({ date });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6">
      <PageNavHeader pageTitle="Add Service" />

      <main className="space-y-8 pb-40 mt-6">
        {/* Title Section */}
        <div>
          <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest block">
            New Entry
          </span>
          <h2 className="text-4xl font-black mt-1 uppercase font-mono tracking-tight">
            Log Maintenance
          </h2>
        </div>

        {/* Centralizando a submissão com o comportamento semântico nativo */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Service Type */}
          <MainInput
            label="Service Type"
            type="text"
            placeholder="Maintenance, Car Wash..."
            required
          />

          {/* Provider / Workshop */}
          <MainInput
            label="Provider / Workshop"
            type="text"
            placeholder="Garage or Shop Name"
            required
          />

          {/* Total Cost */}
          <div className="w-full relative">
            <MainInput
              label="Total Cost"
              type="text"
              placeholder="0.00"
              
              required
            />
          </div>

          {/* Current Odometer */}
          <div className="w-full relative">
            <MainInput
              label="Current Odometer"
              type="text"
              placeholder="0"
              required
            />
            <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
              KM
            </span>
          </div>

          {/* Service Date com Máscara e Ícone Duplo */}
          <div className="w-full relative">
            <MainInput
              label="Service Date"
              type="text"
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

          {/* Notes - Refatorado para o componente MainTextArea */}
          <MainTextArea
            label="Notes"
            placeholder="Describe the service performed..."
            rows={5}
            required
          />

          {/* Botão semântico limpo delegando a ação diretamente para o formulário pai */}
          <SaveButton title="Save Service" />
        </form>
      </main>
    </div>
  );
};

export default AddServicePage;