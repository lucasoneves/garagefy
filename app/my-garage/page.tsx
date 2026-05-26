'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineDirectionsCar } from 'react-icons/md';

import BottomNav from '@/components/BottomNav';
import PageNavHeader from '@/components/PageNavHeader';

// Mock inicial de veículos baseado no design enviado
const initialVehicles = [
  {
    id: '1',
    make: 'Volkswagen',
    model: 'Gol 1.6',
    odometer: '55.200 km',
    active: true,
  },
  {
    id: '2',
    make: 'BMW',
    model: 'M4',
    odometer: '12.450 km',
    active: false,
  },
];

const MyGaragePage = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);

  // Função para gerenciar a troca de veículo ativo localmente
  const handleSetActive = (id: string) => {
    setVehicles(
      vehicles.map((car) => ({
        ...car,
        active: car.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans">
      
      {/* Header */}
      <PageNavHeader pageTitle="My Garage"/>

      {/* Lista de Veículos */}
      <section className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-[#121212] rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300 border ${
              vehicle.active
                ? 'border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20'
                : 'border-zinc-900'
            }`}
          >
            {/* Badge de Ativo */}
            {vehicle.active && (
              <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest mb-3">
                Active
              </span>
            )}

            {/* Corpo do Card */}
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className='flex gap-2 items-center justify-around'>
                  <h2 className="text-2xl font-bold leading-tight tracking-tight">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="text-sm text-zinc-500 font-medium mt-1">
                    {vehicle.odometer}
                  </p>
                </div>

                {/* Botão de ativação se o carro não for o atual */}
                {!vehicle.active && (
                  <button
                    onClick={() => handleSetActive(vehicle.id)}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors mt-2"
                  >
                    Set Active <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Botão tracejado "Add New Vehicle" */}
        <Link
          href="/add-vehicle"
          className="w-full border-2 border-dashed border-zinc-800/80 rounded-[2rem] py-8 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.99]"
        >
          <IoAddCircleOutline size={28} />
          <span className="font-bold text-xs uppercase tracking-widest">
            Add New Vehicle
          </span>
        </Link>
      </section>

      <BottomNav />

    </div>
  );
};

export default MyGaragePage;