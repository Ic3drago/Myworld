import {
  Gamepad2,
  Sparkles,
  Code2,
  Music,
  Palette,
  Trophy,
  Ghost,
  type LucideIcon,
} from 'lucide-react';
import type { CommunityIconKey } from '@/types';

const iconMap: Record<CommunityIconKey, LucideIcon> = {
  gamepad: Gamepad2,
  sparkles: Sparkles,
  code: Code2,
  music: Music,
  palette: Palette,
  trophy: Trophy,
  ghost: Ghost,
};

export function CommunityIcon({
  icon,
  className,
}: {
  icon: CommunityIconKey;
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Sparkles;
  return <Icon className={className} />;
}
