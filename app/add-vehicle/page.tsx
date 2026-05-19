"use client";

import React from "react";
import Link from "next/link";
import { HiArrowLeft, HiPlus } from "react-icons/hi";
import { MdDirectionsCar } from "react-icons/md";

const AddVehiclePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header com Navegação para Profile */}
      <header className="flex items-center justify-between mb-8">
        <Link
          href="/profile"
          className=" hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Back to Profile"
        >
          <HiArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Add Vehicle</h1>
        <div className="w-10"></div> {/* Spacer para centralizar */}
      </header>

      <form className="max-w-md mx-auto space-y-6">
        {/* Upload Vehicle Photo Section */}
        <div className="relative group cursor-pointer">
          <div className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all">
            <div className="bg-zinc-800/50 p-4 rounded-2xl text-zinc-500 group-hover:text-zinc-300 transition-colors">
              <MdDirectionsCar size={40} />
            </div>
            <span className="text-zinc-500 font-bold text-sm tracking-tight">
              Upload Vehicle Photo
            </span>
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Form Fields Section */}
        <div className="space-y-5">
          {/* Make */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-widest">
              Make
            </label>
            <input
              type="text"
              placeholder="e.g. BMW"
              className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-5 px-6 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 font-medium"
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-widest">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. M4 Competition"
              className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-5 px-6 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 font-medium"
            />
          </div>

          {/* Row: Year and License Plate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-widest">
                Year
              </label>
              <input
                type="text"
                placeholder="2024"
                className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-5 px-6 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-widest">
                License Plate
              </label>
              <input
                type="text"
                placeholder="ABC-1234"
                className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-5 px-6 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 font-medium uppercase"
              />
            </div>
          </div>

          {/* Current Odometer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-widest">
              Current Odometer (KM)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-5 px-6 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 font-medium"
              />
              <span className="absolute inset-y-0 right-6 flex items-center text-zinc-500 font-bold text-sm lowercase">
                km
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            className="w-full bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            <HiPlus size={20} />
            Add to My Garage
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehiclePage;
