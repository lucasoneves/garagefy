import React, { TextareaHTMLAttributes } from "react";
import { IconType } from "react-icons";

interface MainTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: IconType;
}

const MainTextArea = ({ label, icon: Icon, className = "", ...props }: MainTextAreaProps) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
          {label}
        </label>
      )}
      
      <div className="relative w-full">
        {/* Ícone dinâmico posicionado no topo esquerdo do bloco de texto */}
        {Icon && (
          <div className="absolute left-4 top-4 text-zinc-500 pointer-events-none transition-colors">
            <Icon size={20} />
          </div>
        )}
        
        <textarea
          {...props}
          className={`w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-[2rem] py-4 pr-4 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200 resize-none ${
            Icon ? "pl-12" : "pl-5"
          } ${className}`}
        />
      </div>
    </div>
  );
};

export default MainTextArea;