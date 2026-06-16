'use client';

import Image from "next/image";
import { HiOutlineCog } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "./auth-provider";

export default function MainHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src="https://i.pravatar.cc/20"
            alt="Avatar"
            className="w-12 h-12 rounded-2xl bg-zinc-800"
            width={20}
            height={20}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
        </div>
        <div>
          <p className="text-zinc-500 text-sm">Welcome back,</p>
          <h2 className="font-bold text-lg">{user?.name ?? '...'}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={signOut}
          className="p-3 bg-zinc-900/50 rounded-2xl hover:bg-zinc-800 transition-colors"
        >
          <HiOutlineLogout size={24} className="text-zinc-300" />
        </button>
        <Link
          href="/settings"
          className="p-3 bg-zinc-900/50 rounded-2xl hover:bg-zinc-800 transition-colors"
        >
          <HiOutlineCog size={24} className="text-zinc-300" />
        </Link>
      </div>
    </header>
  );
}
