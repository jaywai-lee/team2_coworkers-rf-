import { getImageSrc } from '@/shared/lib/getImageSrc';
import type { TeamItem } from './types';
import userIcon from '@/shared/assets/icons/user.svg';

export const DEFAULT_TEAM_ITEMS: readonly TeamItem[] = [
  { id: 'team-1', label: '경영관리팀' },
  { id: 'team-2', label: '프로덕트팀' },
  { id: 'team-3', label: '마케팅팀' },
] as const;

export const defaultProfileImgSrc = getImageSrc(userIcon);
export const defaultProfileBgClass = 'rounded-xl bg-background-teritory';
export const drawerToggleNoop = () => {};
