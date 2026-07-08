'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import PageNavHeader from '@/components/PageNavHeader';

const SecurityPrivacyPage = () => {
  const [biometrics, setBiometrics] = useState(true);
  const [invisibleMode, setInvisibleMode] = useState(false);

  const handleDeleteAccount = () => {
    const confirmDelete = confirm("Are you sure you want to delete your account and all vehicle records? This operation cannot be undone.");
    if (confirmDelete) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 font-sans selection:bg-red-500/20">
      
      <PageNavHeader pageTitle="Security & Privacy" />

      <div 
        className="w-full rounded-[2rem] h-44 relative overflow-hidden mt-6 mb-8 bg-cover bg-center border border-zinc-900/50 flex flex-col justify-end p-6"
        style={{ 
          backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.95) 20%, rgba(10,10,10,0.4) 100%), url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop')` 
        }}
      >
        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md w-max mb-1">
          Account Shield
        </span>
        <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-[240px]">
          Protect your vehicle data with enterprise-grade security protocols.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">
          Access Control
        </h3>
        
        <div className="bg-[#121212] border border-zinc-900/60 rounded-[2rem] overflow-hidden p-2 space-y-1">

          {/* Link: Change Password */}
          <Link 
            href="/security/change-password" 
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-800/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">Change Password</span>
            </div>
            <HiOutlineChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>

        </div>
      </section>

      {/* Seção: Data Privacy */}
      <section className="mb-10">
        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">
          Data Privacy
        </h3>
        
        <div className="bg-[#121212] border border-zinc-900/60 rounded-[2rem] overflow-hidden p-2">
          {/* Toggle: Invisible Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div>
                <span className="font-bold text-sm block">Invisible Mode</span>
                <span className="text-[11px] text-zinc-500 font-medium block mt-0.5">
                  Hides license plate and exact values in reports.
                </span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setInvisibleMode(!invisibleMode)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${
                invisibleMode ? 'bg-blue-500' : 'bg-zinc-800'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${
                invisibleMode ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* Botão de Exclusão de Conta */}
      <button 
        onClick={handleDeleteAccount}
        className="w-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-4 rounded-[2rem] flex items-center justify-center gap-2 transition-all active:scale-[0.99] text-sm mb-8"
      >
        <MdOutlineRemoveCircleOutline size={18} />
        <span>Delete Account and Data</span>
      </button>

      {/* Rodapé de Disclaimer de Criptografia */}
      <footer className="text-center">
        <p className="text-[9px] text-zinc-600 font-mono tracking-wider uppercase">
          Garagefy v2.4.0 • Secured by End-to-End Encryption
        </p>
      </footer>

    </div>
  );
};

export default SecurityPrivacyPage;