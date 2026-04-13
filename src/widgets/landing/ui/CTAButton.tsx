import { useStartNavigation } from '@/features/user/hooks/useStartNavigation';
import { Button } from '@/shared/ui/Button/Button';

export const CTAButton = () => {
  const { navigateToStart, isLoading } = useStartNavigation();

  return (
    <Button variant="primary" size="lg" onClick={navigateToStart} disabled={isLoading}>
      지금 시작하기
    </Button>
  );
};
