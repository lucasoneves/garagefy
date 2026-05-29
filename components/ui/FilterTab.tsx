import React from 'react';
import FilterButton from './FilterButton';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterTabProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  size?: 'small' | 'regular';
  className?: string;
}

const FilterTab = ({
  options,
  selectedValue,
  onChange,
  size = 'regular',
  className = "",
}: FilterTabProps) => {
  return (
    <div className={`flex flex-wrap gap-2 w-full ${className}`}>
      {options.map((option) => {
        const isActive = selectedValue === option.value;

        return (
          <FilterButton
            key={option.value}
            label={option.label}
            isActive={isActive}
            size={size}
            onClick={() => onChange(option.value)}
            type="button" // Garante o comportamento isolado mesmo dentro de <form>
          />
        );
      })}
    </div>
  );
};

export default FilterTab;