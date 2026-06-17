'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { FiLock, FiCheck } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (!token) {
      setError('Token de recuperação inválido ou ausente.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Erro ao redefinir senha. O token pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold mb-2">Link inválido</h1>
          <p className="text-zinc-500 text-sm mb-8">
            O link de recuperação é inválido ou está ausente.
          </p>
          <Link
            href="/forgot-password"
            className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-2xl py-4 font-bold text-sm"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm"
        >
          Voltar ao login
        </Link>

        {success ? (
          <>
            <div className="size-14 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-500" size={28} />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">Senha redefinida</h1>
            <p className="text-zinc-500 text-sm text-center mb-8 leading-relaxed">
              Sua senha foi alterada com sucesso.
              Redirecionando para o login...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Redefinir senha</h1>
            <p className="text-zinc-500 mb-8 text-sm">
              Escolha uma nova senha para sua conta.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase pl-1">
                  Nova senha
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-zinc-500" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#1a1a1a]/40 border border-zinc-800/60 rounded-2xl py-4 pr-4 pl-12 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600 text-sm text-zinc-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase pl-1">
                  Confirmar senha
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-zinc-500" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
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
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
