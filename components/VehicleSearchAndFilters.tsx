'use client';

import { useState, useEffect, useRef } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';

interface VehicleSearchAndFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
}

const VehicleSearchAndFilters = ({
  search,
  onSearchChange,
}: VehicleSearchAndFiltersProps) => {
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef(search);
  searchRef.current = search;

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleChange = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 400);
  };

  const handleClear = () => {
    setSearchInput('');
    onSearchChange('');
  };

  return (
    <div className="relative">
      <IoSearch
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Buscar por marca, modelo, placa..."
        value={searchInput}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-[#121212] border border-zinc-800/60 rounded-2xl py-3.5 pl-11 pr-11 focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200"
      />
      {searchInput && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};

export default VehicleSearchAndFilters;
