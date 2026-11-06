import { Sparkles, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { dailyRecommendation } from '@/data/communities';
import { CommunityIcon } from '@/components/communities/CommunityIcon';
import { Button } from '@/components/ui/Button';
import { gradientFromPair } from '@/utils/helpers';

/** Featured daily recommendation shown in the right panel. */
export function RecommendationCard() {
  const { getCommunity, isJoined, joinCommunity } = useApp();
  const navigate = useNavigate();
  const community = getCommunity(dailyRecommendation.communityId);
  if (!community) return null;

  const joined = isJoined(community.id);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-500/25 p-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: gradientFromPair(community.gradient) }}
      />
      <div className="absolute inset-0 bg-night-900/40" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
          <Sparkles className="h-3.5 w-3.5" /> Recomendación del día
        </span>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25">
            <CommunityIcon icon={community.icon} className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-white">{community.name}</p>
            <p className="text-xs text-slate-300">{community.category}</p>
          </div>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-300">{dailyRecommendation.reason}</p>
        <div className="mt-3">
          <Button
            size="sm"
            fullWidth
            variant={joined ? 'secondary' : 'primary'}
            leftIcon={joined ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            onClick={() => (joined ? navigate('/communities') : joinCommunity(community.id))}
          >
            {joined ? 'Ya eres miembro' : 'Unirme'}
          </Button>
        </div>
      </div>
    </div>
  );
}
