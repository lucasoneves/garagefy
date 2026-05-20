'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HiOutlineCalendar, 
  HiOutlineRefresh 
} from 'react-icons/hi';
import { 
  BsFuelPump, 
  BsWrench, 
  BsShieldExclamation,
  BsWallet2 
} from 'react-icons/bs';
import { 
  AiOutlineLayout, 
  AiOutlineUser 
} from 'react-icons/ai';
import { MdOutlineDirectionsCar } from 'react-icons/md';

// Mock de dados das transações recentes baseado na imagem
const transactions = [
  {
    id: 1,
    title: 'Shell Station',
    date: 'May 18',
    amount: '-$45.00',
    detail: '15.4 l',
    type: 'fuel',
    icon: <BsFuelPump size={20} className="text-blue-500" />
  },
  {
    id: 2,
    title: 'Master Service',
    date: 'May 14',
    amount: '-$280.00',
    detail: 'maintenance',
    type: 'service',
    icon: <BsWrench size={20} className="text-orange-400" />
  },
  {
    id: 3,
    title: 'Chevron #42',
    date: 'May 09',
    amount: '-$52.20',
    detail: '18.1 l',
    type: 'fuel',
    icon: <BsFuelPump size={20} className="text-blue-500" />
  },
  {
    id: 4,
    title: 'Insurance Deductible',
    date: 'May 02',
    amount: '-$250.00',
    detail: 'incident #4021',
    type: 'incident',
    icon: <BsShieldExclamation size={20} className="text-red-400" />
  },
];

const categories = ['ALL', 'EXPENSES', 'FUEL', 'SERVICE'];

const ExpensesPage = () => {
  const [activeCategory, setActiveCategory] = useState('EXPENSES');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-center flex-1">Expenses</h1>
      </header>

      {/* Main Consolidated Card */}
      <section className="bg-[#121212] border border-zinc-900 rounded-[2.5rem] p-8 mb-6 relative overflow-hidden">
        <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">
          May 2026
        </p>
        <div className="flex items-baseline mb-6">
          <span className="text-5xl font-black">$650</span>
          <span className="text-2xl font-bold text-blue-400">.00</span>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">
              Avg. Daily
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">$20</span>
              <span className="text-xs font-medium text-zinc-500 lowercase">usd</span>
            </div>
          </div>
          
          {/* Mini Indicador de Gráfico Decorativo à Direita */}
          <div className="flex items-end gap-1 h-10 opacity-60">
            <div className="w-1.5 h-4 bg-zinc-800 rounded-full"></div>
            <div className="w-1.5 h-8 bg-zinc-800 rounded-full"></div>
            <div className="w-1.5 h-5 bg-zinc-800 rounded-full"></div>
            <div className="w-1.5 h-10 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            <div className="w-1.5 h-6 bg-zinc-800 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Horizontal Category Filters */}
      <section className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-3 rounded-full font-bold text-xs tracking-wider transition-all duration-200 shrink-0 ${
              activeCategory === category
                ? 'bg-[#007BFF] text-white shadow-md shadow-blue-500/10'
                : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60'
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Recent Transactions List */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
            Recent Transactions
          </h3>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <HiOutlineRefresh size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-[#121212] border border-zinc-900 rounded-[2rem] p-5 flex items-center justify-between hover:border-zinc-800/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icon Wrapper Container */}
                <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/30">
                  {tx.icon}
                </div>
                <div>
                  <h4 className="font-bold text-base leading-tight tracking-tight text-zinc-100">
                    {tx.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-base text-zinc-100 tracking-tight">
                  {tx.amount}
                </span>
                <p className="text-[10px] text-zinc-600 font-bold lowercase mt-0.5 tracking-tight">
                  {tx.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ExpensesPage;