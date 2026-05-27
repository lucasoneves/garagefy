"use client";

import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiCamera } from "react-icons/bi";
import PageNavHeader from "@/components/PageNavHeader";
import SaveButton from "@/components/SaveButton";

type Category = "Observation" | "Reminder" | "To-do";

const AddLogbookEntryPage = () => {
  const [category, setCategory] = useState<Category>("Observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log({ category, title, description });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans selection:bg-blue-500/30">
      <PageNavHeader pageTitle="New Entry" lastPage="/logbook" />

      <div className="mt-4 px-1">
        <span className="text-xl font-black py-1 rounded-md w-max mb-1 block">
          Logbook Module
        </span>
        <p className="text-sm text-zinc-400 font-medium">
          Record and track vehicle health
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] border border-zinc-900/60 rounded-[2.5rem] mt-10 p-6 space-y-6"
      >
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("Observation")}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 ${
                category === "Observation"
                  ? "bg-[#007BFF] text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30"
                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60"
              }`}
            >
              <IoEyeOutline size={16} />
              <span>Observation</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory("Reminder")}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 ${
                category === "Reminder"
                  ? "bg-[#007BFF] text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30"
                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60"
              }`}
            >
              <RiNotificationBadgeLine size={16} />
              <span>Reminder</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory("To-do")}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 ${
                category === "To-do"
                  ? "bg-[#007BFF] text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30"
                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60"
              }`}
            >
              <AiOutlineCheckCircle size={16} />
              <span>To-do</span>
            </button>
          </div>
        </div>

        {/* Campo de Entrada: Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Oil level check"
            className="w-full bg-zinc-900/50 border border-zinc-800/30 text-sm text-zinc-200 rounded-full px-5 py-4 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            required
          />
        </div>

        {/* Campo de Texto Expandido: Notes / Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block pl-1">
            Notes / Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your observation here..."
            rows={5}
            className="w-full bg-zinc-900/50 border border-zinc-800/30 text-sm text-zinc-200 rounded-[2rem] px-5 py-4 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none min-h-[140px]"
            required
          ></textarea>
        </div>

        <div className="w-full h-px bg-zinc-900/60 my-2"></div>

        <button
          type="button"
          className="w-full flex items-center gap-3 py-2 text-zinc-400 hover:text-zinc-200 transition-colors group text-left"
        >
          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/40 group-hover:bg-zinc-800 transition-colors">
            <BiCamera size={18} />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Attach image or receipt
          </span>
        </button>

        <SaveButton title="Save Entry" />
      </form>
    </div>
  );
};

export default AddLogbookEntryPage;