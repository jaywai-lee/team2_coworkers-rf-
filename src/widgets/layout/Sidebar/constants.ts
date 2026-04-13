import { getImageSrc } from '@/shared/lib/getImageSrc';
import type { TeamItem } from './types';
import userIcon from '@/shared/assets/icons/user.svg';

export const defaultProfileImgSrc = getImageSrc(userIcon);
export const defaultProfileBgClass = 'rounded-xl bg-background-teritory';
export const drawerToggleNoop = () => {};
