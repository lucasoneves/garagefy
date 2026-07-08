'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HiOutlinePencil,
  HiOutlineBell,
  HiOutlineLockClosed,
  HiOutlineDownload,
  HiOutlineChevronRight,
  HiOutlineLogout
} from 'react-icons/hi';
import PageNavHeader from '@/components/PageNavHeader';

const ProfilePage = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">

      <PageNavHeader pageTitle="Settings" cancelable={false} />

      {/* Profile Info */}
      <section className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden">
            <Image 
              src="https://i.pravatar.cc/120" 
              alt="Profile Avatar" 
              className="w-full h-full object-cover bg-zinc-800"
              width={120}
              height={120}
            />
          </div>
          <button className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full border-4 border-[#0a0a0a] hover:bg-blue-600 transition-colors">
            <HiOutlinePencil size={16} />
          </button>
        </div>
        <h2 className="text-3xl font-bold">Alex Johnson</h2>
        <p className="text-zinc-500">alex.j@email.com</p>
      </section>

      {/* My Vehicles Section */}
      <section className="mb-8 px-1">
        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">My Vehicles</h3>
        
        {/* Active Vehicle Card */}
        <div className="bg-[#121212] border border-zinc-800/50 rounded-[2rem] p-5 mb-4 flex items-center gap-4">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-lg leading-tight">Volkswagen Gol 1.6</h4>
              <span className="bg-blue-500/10 text-blue-500 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-sm">
              <span>55.200 KM</span>
            </div>
          </div>
        </div>

        {/* Add Another Vehicle Button */}
        <Link 
          href="/add-vehicle" 
          className="w-full border-2 border-dashed border-zinc-800 rounded-[2rem] py-5 flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-900/30 transition-all active:scale-[0.98]"
        >
          <span className="text-xl">+</span>
          <span className="font-bold text-sm">Add Another Vehicle</span>
        </Link>

        {/* Link: See All Vehicles adicionado logo abaixo da lista */}
        <div className="mt-4 text-center">
          <Link
            href="/my-garage"
            className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors py-2 px-4"
          >
            <span>See All Vehicles</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </section>

      {/* App Settings Section */}
      <section className="mb-12">
        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">App Settings</h3>
        <div className="bg-[#121212] border border-zinc-800/50 rounded-[2rem] overflow-hidden">
          
         

          {/* Security Link */}
          <Link href="/settings/privacy" className="flex items-center justify-between p-5 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-800/50 p-2 rounded-xl text-zinc-300">
                <HiOutlineLockClosed size={22} />
              </div>
              <span className="font-bold">Security</span>
              <span className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Privacy
              </span>
            </div>
            <HiOutlineChevronRight size={20} className="text-zinc-600" />
          </Link>


        </div>
      </section>

      {/* Sign Out Button */}
      <button className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 mb-8 hover:opacity-80 transition-opacity">
        <HiOutlineLogout size={24} />
        <span>Sign Out</span>
      </button>

    </div>
  );
};

export default ProfilePage;