import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { ProfileModal } from '@/components/users/ProfileModal';

/** App shell: fixed sidebar, sticky topbar, routed content and global overlays. */
export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-night-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative h-full w-[280px] animate-fade-in shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 z-10 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} className="bg-night-950" />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastViewport />
      <ProfileModal />
    </div>
  );
}
