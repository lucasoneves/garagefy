import React, { InputHTMLAttributes } from "react";
import { IconType } from "react-icons";

// Interface estende as propriedades nativas do HTMLInputElement
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  // Permite passar qualquer ícone do react-icons de forma dinâmica
  icon?: IconType;
}

const MainInput = ({
  label,
  icon: Icon,
  className = "",
  ...props
}: InputProps) => {
  return (
      <>
        {label && (
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-4 text-zinc-500 pointer-events-none transition-colors">
              <Icon size={20} />
            </div>
          )}

          <input
            {...props}
            className={`w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pr-4 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200 ${
              Icon ? "pl-12" : "pl-5"
            } ${className}`}
          />
        </div>
      </>
  );
};

export default MainInput;
