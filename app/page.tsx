"use client";

import MainCard from "@/components/MainCard";

import { BsPlusLg } from "react-icons/bs";
import MaintenanceAlert from "@/components/MaintenanceAlert";
import MonthlySpendings from "@/components/MonthySpendings";
import QuickActions from "@/components/QuickActions";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans">
      <MainCard />
      <MaintenanceAlert />
      <MonthlySpendings />
      <QuickActions />

      {/* FAB Button */}
      <button className="fixed bottom-28 right-8 w-16 h-16 bg-[#007BFF] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-95 transition-transform z-20">
        <BsPlusLg size={24} />
      </button>
    </div>
  );
};

export default DashboardPage;
