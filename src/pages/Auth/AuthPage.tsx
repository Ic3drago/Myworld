import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, LockKeyhole, UserRoundPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

export function AuthPage() {
  const isRegister = useLocation().pathname === '/register';
  const { login, register, error: serverError, clearError } = useAuth();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    clearError();
    setSubmitting(true);
    try {
      if (isRegister) await register(name, email, handle, password);
      else await login(email, password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo completar el acceso.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-night-850/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
        <Logo />
        <div className="mt-8">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            {isRegister ? <UserRoundPlus className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            {isRegister ? 'Crea tu cuenta' : 'Qué bueno verte'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isRegister ? 'Encuentra comunidades y personas afines.' : 'Inicia sesión para volver a tu espacio.'}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {isRegister && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Nombre</span>
                <Input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Usuario</span>
                <Input autoComplete="username" required minLength={3} maxLength={24} value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="tu_usuario" />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Correo</span>
            <Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Contraseña</span>
            <Input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {(error || serverError) && (
            <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
              {error ?? serverError}
            </p>
          )}

          <Button type="submit" fullWidth disabled={submitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
            {submitting ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
          <Link className="font-medium text-emerald-300 hover:text-emerald-200" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </Link>
        </p>
      </section>
    </main>
  );
}