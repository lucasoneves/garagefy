import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive: boolean;
  size?: 'small' | 'regular';
}

const FilterButton = ({
  label,
  isActive,
  size = 'regular',
  type = 'button',
  className = "",
  ...props
}: FilterButtonProps) => {
  
  const sizeClasses = {
    small: 'px-4 py-2 text-[10px] rounded-full',
    regular: 'px-6 py-3.5 text-xs rounded-full',
  };

  return (
    <button
      type={type}
      {...props}
      className={twMerge(
        `font-black uppercase tracking-widest transition-all duration-200 cursor-pointer select-none`,
        sizeClasses[size],
        isActive
          ? 'bg-[#007BFF] text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30'
          : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300',
        className // O twMerge garante que qualquer classe vinda daqui substitua com sucesso as anteriores
      )}
    >
      {label}
    </button>
  );
};

export default FilterButton;