"use client";
import { MdDirectionsCar } from "react-icons/md";
import PageNavHeader from "@/components/PageNavHeader";
import PageContainer from "@/components/PageContainer";
import { HiPlus } from "react-icons/hi";
import SaveButton from "@/components/SaveButton";

const AddVehiclePage = () => {
  return (
    <PageContainer>
      <PageNavHeader pageTitle='Add Vehicle'/>

      <form className="mx-auto space-y-6">
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
          <SaveButton title="Add to My Garage" handleSave={() => {}} />
      </form>
    </PageContainer>
  );
};

export default AddVehiclePage;
