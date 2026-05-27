"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiArrowLeft,
  HiOutlineCalendar,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import {
  MdOutlineStorefront,
  MdOutlinePayments,
  MdOutlineSpeed,
} from "react-icons/md";
import { LuSave } from "react-icons/lu";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";
import MainInput from "@/components/ui/MainInput";

const AddServicePage = () => {
  const [serviceType, setServiceType] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8); // MMDDYYYY
    let formatted = "";

    if (digits.length >= 2) {
      formatted += digits.slice(0, 2) + "/";
    } else {
      formatted += digits;
    }

    if (digits.length >= 4) {
      formatted += digits.slice(2, 4) + "/";
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

          <div className="space-y-2 w-full">
            <MainInput label="Service Type" type="text" placeholder="Maintenance, Car Wash..." />
          </div>

          <div className="space-y-2 w-full">
            <MainInput
              type="text"
              label="Provider / Workshop"
              placeholder="Garage or Shop Name"/>
          </div>

          <div className="space-y-2 w-full">
            <MainInput
              label="Total Cost"
              type="text"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2 w-full">
            <MainInput
              label="Current Odometer"
              type="text"
              placeholder="0"
            />
          </div>

          <div className="space-y-2 w-full">
            <MainInput
              label="Service Date"
              type="date"
              placeholder="mm/dd/yyyy"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
              Notes
            </label>
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
              This record will be automatically synced to your vehicle's history
              and impact your maintenance schedule analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddServicePage;
