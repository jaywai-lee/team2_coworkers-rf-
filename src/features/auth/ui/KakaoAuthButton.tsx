import { Button } from '@/shared/ui/Button/Button';
import { IconKakao } from '@/shared/ui/icons';

interface KakaoAuthButtonProps {
  onClick: () => void;
}

export function KakaoAuthButton({ onClick }: KakaoAuthButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="text-background-inverse flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] transition-colors hover:bg-[#FDD800]! focus-visible:ring-[#FDD800] active:bg-[#FDD800]"
    >
      <IconKakao size={16} />
      <span className="text-lg font-semibold">카카오로 시작하기</span>
    </Button>
  );
}
