import React, { SelectHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { HiChevronDown } from "react-icons/hi";

interface MainSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: IconType;
  children: React.ReactNode; // Para renderizar as <option> dentro dele
}

const MainSelect = ({ label, icon: Icon, children, className = "", ...props }: MainSelectProps) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {/* Ícone dinâmico à esquerda */}
        {Icon && (
          <div className="absolute left-4 text-zinc-500 pointer-events-none transition-colors">
            <Icon size={20} />
          </div>
        )}
        
        <select
          {...props}
          className={`w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pr-10 focus:outline-none focus:border-zinc-500 transition-colors appearance-none text-sm text-zinc-300 ${
            Icon ? "pl-12" : "pl-5"
          } ${className}`}
        >
          {children}
        </select>

        {/* Seta de seleção nativa customizada fixada à direita */}
        <div className="absolute right-4 text-zinc-500 pointer-events-none">
          <HiChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default MainSelect;