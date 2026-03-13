import MainCard from "@/components/MainCard";
import MaintenanceAlert from "@/components/MaintenanceAlert";
import MonthlySpendings from "@/components/MonthySpendings";
import QuickActions from "@/components/QuickActions";

export default function Home() {
  return (
    <div className="flex min-h-screen font-sans ">
      <main className="w-full">
        <MainCard />
        <MaintenanceAlert />
        <MonthlySpendings />
        <QuickActions />
      </main>
    </div>
  );
}
