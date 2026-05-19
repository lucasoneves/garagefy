'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiOutlineCalendar, 
  HiChevronDown 
} from 'react-icons/hi';
import { 
  BsFuelPumpFill, 
  BsDropletFill, 
  BsSpeedometer2 
} from 'react-icons/bs';
import { LuSave, LuWaves } from 'react-icons/lu';

const AddFuelPage = () => {
  const [date, setDate] = useState('10/27/2023');

  // Máscara simples para data (DD/MM/YYYY)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setDate(value);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header com Navegação para Home */}
      <header className="flex items-center justify-between mb-8">
        <Link 
          href="/" 
          className=" hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Back to Home"
        >
          <HiArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Add Fuel</h1>
        <div className="w-10"></div>
      </header>

      <form className="space-y-6">
        
        {/* Gas Station */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Gas Station</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <BsFuelPumpFill size={20} />
            </span>
            <input 
              type="text" 
              placeholder="Shell, Exxon, BP..." 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Fuel Type - Agora como Select Nativo Customizado */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Fuel Type</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500 pointer-events-none">
              <LuWaves size={20} />
            </span>
            <select 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:border-zinc-500 transition-colors appearance-none text-zinc-300"
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 ml-1">Total Cost</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">$</span>
              <input 
                type="text" 
                placeholder="0.00" 
                className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-8 pr-4 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 ml-1">Price / L</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">$</span>
              <input 
                type="text" 
                placeholder="0.00" 
                className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-8 pr-4 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Liters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Liters</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <BsDropletFill size={18} />
            </span>
            <input 
              type="text" 
              placeholder="0.00" 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-zinc-500"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 font-bold text-xs uppercase tracking-tighter">L</span>
          </div>
        </div>

        {/* Odometer */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Current Odometer</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <BsSpeedometer2 size={20} />
            </span>
            <input 
              type="text" 
              placeholder="45,230" 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-zinc-500"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 font-bold text-xs uppercase tracking-tighter">KM</span>
          </div>
        </div>

        {/* Date com Máscara */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-500 ml-1">Date</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <HiOutlineCalendar size={22} />
            </span>
            <input 
              type="text" 
              value={date}
              onChange={handleDateChange}
              placeholder="DD/MM/YYYY" 
              className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-zinc-500"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500">
              <HiOutlineCalendar size={20} />
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            <LuSave size={20} />
            Save Fuel Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFuelPage;