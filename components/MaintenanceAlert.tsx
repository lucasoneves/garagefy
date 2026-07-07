import Link from "next/link";
import { HiOutlineChevronRight, HiOutlineBell } from "react-icons/hi";

interface MaintenanceAlertProps {
  message: string;
}

export default function MaintenanceAlert({ message }: MaintenanceAlertProps) {
  return (
    <Link
      href="/services"
      className="flex items-center justify-between bg-[#1a1608] border border-amber-900/30 rounded-[2rem] p-5 mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
          <HiOutlineBell size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-500 text-sm">
            Maintenance Alert
          </h4>
          <p className="text-amber-500/70 text-xs">{message}</p>
        </div>
      </div>
      <HiOutlineChevronRight className="text-amber-500/50" />
    </Link>
  );
}
