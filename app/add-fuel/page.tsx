'use client';

import React, { useState } from 'react';
import { 
  HiOutlineCalendar, 
  HiChevronDown 
} from 'react-icons/hi';
import { 
  BsDropletFill, 
  BsSpeedometer2,
  BsFuelPumpFill
} from 'react-icons/bs';
import { LuWaves } from 'react-icons/lu';
import PageNavHeader from '@/components/PageNavHeader';
import SaveButton from '@/components/SaveButton';
import MainInput from '@/components/ui/MainInput';

const AddFuelPage = () => {
  const [date, setDate] = useState('10/27/2023');

  // Máscara simples para data (DD/MM/YYYY)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value.replace(/\D/g, '');
    
    setDate(date);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para salvar os dados no backend
    console.log({ date });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6">
      <PageNavHeader pageTitle="Add Fuel" />

      {/* Engatilhando o onSubmit direto no form usando o comportamento nativo */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-40 mt-6">
        
        {/* Gas Station */}
        <MainInput
          label="Gas Station"
          placeholder="Shell, Exxon, BP..."
          icon={BsFuelPumpFill}
          required
        />

        {/* Fuel Type - Mantido estrutural para suportar a tag select do HTML */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            Fuel Type
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500 pointer-events-none">
              <LuWaves size={20} />
            </span>
            <select 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:border-zinc-500 transition-colors appearance-none text-zinc-300 text-sm"
              defaultValue="gasoline_premium"
            >
              <option value="gasoline_regular">Gasoline (Regular)</option>
              <option value="gasoline_premium">Gasoline (Premium)</option>
              <option value="ethanol">Ethanol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG (Natural Gas)</option>
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <HiChevronDown size={20} />
            </span>
          </div>
        </div>

        {/* Grid de Custos */}
        <div className="grid grid-cols-2 gap-4">
          <MainInput
            label="Total Cost"
            placeholder="0.00"
            // Retorna o caractere de moeda estilizado injetado no espaço do ícone
            icon={() => <span className="text-zinc-500 text-base font-medium">$</span>}
            required
          />
          <MainInput
            label="Price / L"
            placeholder="0.00"
            icon={() => <span className="text-zinc-500 text-base font-medium">$</span>}
            required
          />
        </div>

        {/* Liters */}
        <div className="relative w-full">
          <MainInput
            label="Liters"
            placeholder="0.00"
            icon={BsDropletFill}
            required
          />
          {/* Sufixo de Unidade flutuante à direita */}
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            L
          </span>
        </div>

        {/* Odometer */}
        <div className="relative w-full">
          <MainInput
            label="Current Odometer"
            placeholder="45,230"
            icon={BsSpeedometer2}
            required
          />
          <span className="absolute bottom-4 right-5 text-zinc-500 font-bold text-xs uppercase tracking-tighter pointer-events-none">
            KM
          </span>
        </div>

        {/* Date com Máscara */}
        <div className="relative w-full">
          <MainInput
            label="Date"
            type='date'
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

        {/* Botão semântico limpo delegando a ação diretamente para o formulário pai */}
        <SaveButton title="Save Fuel Entry" />
      </form>
    </div>
  );
};

export default AddFuelPage;