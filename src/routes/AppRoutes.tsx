import { Link, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { Discover } from '@/pages/Discover/Discover';
import { People } from '@/pages/People/People';
import { FindTeam } from '@/pages/FindTeam/FindTeam';
import { Communities } from '@/pages/Communities/Communities';
import { Messages } from '@/pages/Messages/Messages';
import { Events } from '@/pages/Events/Events';
import { Saved } from '@/pages/Saved/Saved';
import { Settings } from '@/pages/Settings/Settings';
import { Profile } from '@/pages/Profile/Profile';
import { Button } from '@/components/ui/Button';

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-display text-xl text-white">Esta página no existe</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Puede que el enlace esté roto o que la sección se haya movido.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/people" element={<People />} />
        <Route path="/team" element={<FindTeam />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/events" element={<Events />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
