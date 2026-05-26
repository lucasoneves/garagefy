"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillLayout, AiOutlineUser } from "react-icons/ai";
import { BiWalletAlt } from "react-icons/bi";
import { MdOutlineDirectionsCar } from "react-icons/md";

const BottomNav = () => {
  const pathname = usePathname() ?? "/";

  const isActiveFor = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="fixed w-full bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-4 flex justify-between items-center z-30">
      <div className="max-w-2xl w-full justify-between m-auto flex px-4">
        <NavItem
          icon={<AiFillLayout size={24} />}
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
          icon={<BiWalletAlt size={24} />}
          label="Expenses"
          path="/expenses"
          active={isActiveFor("/expenses")}
        />
        <NavItem
          icon={<AiOutlineUser size={24} />}
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
