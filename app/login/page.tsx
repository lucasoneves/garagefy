'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
    } catch {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-2">Entrar</h1>
        <p className="text-zinc-500 mb-8 text-sm">
          Acesse sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase pl-1">
              Email
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-4 text-zinc-500" size={20} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pr-4 pl-12 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase pl-1">
              Senha
            </label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-4 text-zinc-500" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pr-4 pl-12 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline text-sm text-right -mt-2"
          >
            Esqueci minha senha
          </Link>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl py-4 font-bold text-sm"
          >
            Entrar
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
