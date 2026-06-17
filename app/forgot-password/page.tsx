'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Erro ao solicitar recuperação. Verifique o email informado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <FiArrowLeft size={18} />
          Voltar ao login
        </Link>

        {sent ? (
          <>
            <div className="size-14 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-blue-500" size={28} />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">Email enviado</h1>
            <p className="text-zinc-500 text-sm text-center mb-8 leading-relaxed">
              Se o email <strong className="text-zinc-300">{email}</strong> estiver
              cadastrado, você receberá um link para redefinir sua senha.
            </p>
            <Link
              href="/login"
              className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-2xl py-4 font-bold text-sm"
            >
              Voltar ao login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Recuperar senha</h1>
            <p className="text-zinc-500 mb-8 text-sm">
              Digite seu email e enviaremos um link para redefinir sua senha.
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

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-zinc-400 transition-colors rounded-2xl py-4 font-bold text-sm"
              >
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>

            <p className="text-zinc-500 text-sm text-center mt-6">
              Lembrou a senha?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
