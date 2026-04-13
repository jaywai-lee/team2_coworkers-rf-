import { useEffect, useRef, useState } from 'react';
import { IconPencil, IconUser } from '@/shared/ui/icons';
import { IconButton } from '@/shared/ui/Button/IconButton';
import { useImagePicker } from '@/shared/hooks/useImagePicker';
import { getImageSrc } from '@/shared/lib/getImageSrc';
import { cn } from '@/shared/lib/cn';
import type { ImageAsset } from './Profile.types';

export type ProfileEditSize = 'large' | 'x-large' | 'account-pc' | 'account-mobile';

const SIZE_CONFIG = {
  large: {
    w: 77,
    h: 78,
    borderRadius: 20,
    borderWidth: 2,
    pencilBtn: 24,
    pencilIcon: 14,
    pencilOffset: -3,
  },
  'x-large': {
    w: 112,
    h: 116,
    borderRadius: 32,
    borderWidth: 2.22,
    pencilBtn: 32,
    pencilIcon: 20,
    pencilOffset: -4,
  },

  'account-pc': {
    w: 100,
    h: 100,
    borderRadius: 28,
    borderWidth: 2,
    pencilBtn: 28,
    pencilIcon: 16,
    pencilOffset: -2,
  },

  'account-mobile': {
    w: 64,
    h: 64,
    borderRadius: 18,
    borderWidth: 2,
    pencilBtn: 24,
    pencilIcon: 14,
    pencilOffset: -4,
  },
} as const;

type Props = {
  size?: ProfileEditSize;
  imageSrc?: ImageAsset | null;
  alt?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
  className?: string;
};

export function ProfileEdit({
  size = 'x-large',
  imageSrc,
  alt = '프로필 이미지',
  ariaLabel,
  disabled = false,
  onChange,
  className,
}: Props) {
  const config = SIZE_CONFIG[size];
  const inputRef = useRef<HTMLInputElement | null>(null);

  const initialImage = imageSrc != null ? getImageSrc(imageSrc) : null;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
    setImgError(false);
  }, [initialImage]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const { addImages } = useImagePicker({
    maxCount: 1,
    defaultImages: [],
    onChange: ({ files }) => {
      const file = files[0] ?? null;
      onChange?.(file);
      if (!file) return;

      const nextUrl = URL.createObjectURL(file);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
      setImgError(false);
    },
  });

  const resolvedImageSrc = previewUrl ?? initialImage ?? undefined;
  const shouldShowImage = resolvedImageSrc != null && !imgError;

  return (
    <div
      className={cn('relative inline-flex shrink-0', className)}
      style={{ width: config.w, height: config.h }}
    >
      <div
        className={cn(
          'inline-flex items-center justify-center overflow-hidden',
          shouldShowImage ? 'bg-transparent' : 'bg-background-tertiary',
        )}
        style={{
          width: config.w,
          height: config.h,
          borderRadius: config.borderRadius,
          border: `${config.borderWidth}px solid var(--color-background-tertiary)`,
        }}
        aria-label={ariaLabel}
        role="img"
      >
        {shouldShowImage ? (
          <img
            src={resolvedImageSrc}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <IconUser size={config.w} className="text-icon-inverse" />
        )}
      </div>

      <IconButton
        type="button"
        variant="surface"
        disabled={disabled}
        aria-label={ariaLabel ? `${ariaLabel} 이미지 수정` : '프로필 이미지 수정'}
        className="absolute"
        style={{
          width: config.pencilBtn,
          height: config.pencilBtn,
          borderWidth: config.borderWidth,
          right: config.pencilOffset,
          bottom: config.pencilOffset,
        }}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.click();
        }}
      >
        <IconPencil size={config.pencilIcon} className="text-icon-primary" />
      </IconButton>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={(e) => {
          if (disabled) return;
          const files = e.target.files;
          if (files == null || files.length === 0) return;
          addImages(files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
