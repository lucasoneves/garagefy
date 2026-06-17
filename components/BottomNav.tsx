"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineDirectionsCar } from "react-icons/md";
import { BiWrench, BiSolidGasPump } from "react-icons/bi";
import { LuNotebook } from "react-icons/lu";

const BottomNav = () => {
  const pathname = usePathname() ?? "/";

  const isActiveFor = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="fixed w-full bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-4 flex justify-between items-center z-30">
      <div className="max-w-2xl w-full justify-between m-auto flex">
        <NavItem
          icon={<MdOutlineSpaceDashboard size={24} />}
          label="Dashboard"
          path="/"
          active={isActiveFor("/")}
        />
        <NavItem
          icon={<MdOutlineDirectionsCar size={24} />}
          label="Garage"
          path="/my-garage"
          active={isActiveFor("/my-garage")}
        />
        <NavItem
          icon={<BiWrench size={24} />}
          label="Services"
          path="/services"
          active={isActiveFor("/services")}
        />
        <NavItem
          icon={<BiSolidGasPump size={24} />}
          label="Fuel"
          path="/fuel"
          active={isActiveFor("/fuel")}
        />
        <NavItem
          icon={<LuNotebook size={24} />}
          label="Logbook"
          path="/logbook"
          active={isActiveFor("/logbook")}
        />
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}

const NavItem = ({ icon, label, path, active = false }: NavItemProps) => (
  <Link
    href={path}
    aria-current={active ? "page" : undefined}
    className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
      active ? "text-blue-500" : "text-zinc-600 hover:text-zinc-400"
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </Link>
);

export default BottomNav;
