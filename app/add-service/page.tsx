'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiOutlineCalendar, 
  HiOutlineInformationCircle 
} from 'react-icons/hi';
import { 
  MdOutlineStorefront, 
  MdOutlinePayments,
  MdOutlineSpeed 
} from 'react-icons/md';
import { LuSave } from 'react-icons/lu';
import PageNavHeader from '@/components/PageNavHeader';
import SaveButton from '@/components/SaveButton';

const AddServicePage = () => {
  const [serviceType, setServiceType] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8); // MMDDYYYY
    let formatted = '';

    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + '/';
    } else {
      formatted += digits;
    }

    if (digits.length >= 4) {
      formatted += digits.slice(2, 4) + '/';
    } else if (digits.length > 2) {
      formatted += digits.slice(2);
    }

    if (digits.length > 4) {
      formatted += digits.slice(4);
    }

    return formatted;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatDateInput(e.target.value));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <PageNavHeader pageTitle="Add Service" />

      <main className="space-y-8 pb-40">
        {/* Title Section */}
        <div>
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
            New Entry
          </span>
          <h2 className="text-4xl font-bold mt-1">Log Maintenance</h2>
        </div>

        <form className="space-y-6">
          
          {/* Service Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Service Type</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <MdOutlineStorefront size={22} />
              </span>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="Service type"
                className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Provider / Workshop */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Provider / Workshop</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <MdOutlineStorefront size={22} />
              </span>
              <input 
                type="text" 
                placeholder="Garage or Shop Name" 
                className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Total Cost */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Total Cost</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <MdOutlinePayments size={22} />
              </span>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-4 pl-12 pr-16 focus:outline-none focus:border-zinc-600"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 text-sm font-medium">USD</span>
            </div>
          </div>

          {/* Current Odometer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Current Odometer</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <MdOutlineSpeed size={22} />
              </span>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-zinc-600"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 text-sm font-medium">KM</span>
            </div>
          </div>

          {/* Service Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Service Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <HiOutlineCalendar size={22} />
              </span>
              <input 
                type="text" 
                placeholder="mm/dd/yyyy" 
                value={date}
                onChange={handleDateChange}
                className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-zinc-600"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-zinc-400">
                <HiOutlineCalendar size={20} />
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Notes</label>
            <textarea 
              placeholder="Describe the service performed..." 
              rows={4}
              className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-2xl py-4 px-4 focus:outline-none focus:border-zinc-600 resize-none placeholder:text-zinc-600"
            />
          </div>

          <SaveButton title="Save Service" handleSave={() => {}} />
        </form>

        {/* Info Card */}
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-5 flex gap-4">
          <div className="mt-1">
            <HiOutlineInformationCircle size={24} className="text-orange-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Data Syncing</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This record will be automatically synced to your vehicle's history and impact your maintenance schedule analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddServicePage;