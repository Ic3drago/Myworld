import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Gamepad2,
  MessageSquare,
  UserPlus,
  Check,
  Sparkles,
  Users,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Chip';
import { useApp } from '@/context/AppContext';
import { gradientFromPair } from '@/utils/helpers';

/** Global profile preview modal opened from any user card. */
export function ProfileModal() {
  const {
    profileUserId,
    getUser,
    closeProfile,
    isConnected,
    connectUser,
    openConversation,
    conversations,
    pushToast,
  } = useApp();
  const navigate = useNavigate();

  const user = profileUserId ? getUser(profileUserId) : undefined;
  if (!user) return null;

  const connected = isConnected(user.id);

  const handleMessage = () => {
    const convo = conversations.find((c) => c.participantId === user.id);
    if (convo) {
      openConversation(convo.id);
      closeProfile();
      navigate('/messages');
    } else {
      pushToast(`Aún no tienes una conversación con ${user.name}`, 'info');
    }
  };

  return (
    <Modal open onClose={closeProfile} size="lg">
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="h-24" style={{ backgroundImage: gradientFromPair(user.gradient) }} />
          <div className="absolute inset-0 bg-night-950/20" />
          <div className="px-5 pb-5">
            <div className="-mt-10 flex items-end gap-4">
              <Avatar
                size="xl"
                name={user.name}
                initials={user.initials}
                gradient={user.gradient}
                online={user.online}
                ring
              />
              <div className="pb-1">
                <h2 className="font-display text-xl text-white">{user.name}</h2>
                <p className="text-sm text-slate-400">{user.handle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" dot>
            {user.compatibility}% de compatibilidad
          </Badge>
          <Badge variant={user.online ? 'success' : 'neutral'} dot>
            {user.online ? 'En línea' : 'Desconectado'}
          </Badge>
          {user.role && (
            <Badge variant="info">
              <Briefcase className="mr-1 h-3 w-3" />
              {user.role}
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-300">{user.bio}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> Ubicación
            </p>
            <p className="text-sm text-slate-200">{user.location}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Users className="h-3.5 w-3.5" /> Comunidades en común
            </p>
            <p className="text-sm text-slate-200">{user.mutualCommunities ?? 0}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Sparkles className="h-3.5 w-3.5" /> Intereses
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((interest) => (
              <Tag key={interest}>{interest}</Tag>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Gamepad2 className="h-3.5 w-3.5" /> Juegos favoritos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.games.map((game) => (
              <Tag key={game}>{game}</Tag>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            fullWidth
            variant={connected ? 'secondary' : 'primary'}
            leftIcon={connected ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            onClick={() => connectUser(user.id)}
          >
            {connected ? 'Conectado' : 'Conectar'}
          </Button>
          <Button
            fullWidth
            variant="outline"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={handleMessage}
          >
            Mensaje
          </Button>
        </div>
      </div>
    </Modal>
  );
}
