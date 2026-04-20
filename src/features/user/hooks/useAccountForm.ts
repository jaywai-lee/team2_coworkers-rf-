import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useUserQuery } from './useUserQuery';
import { useUpdateUserMutation } from './useUpdateUserMutation';
import { toast } from 'sonner';

export interface AccountFormValues {
  name: string;
}

export function useAccountForm() {
  const router = useRouter();
  const { mutate: updateProfile, isPending } = useUpdateUserMutation();
  const { data: user } = useUserQuery();

  // 이탈 방지 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<AccountFormValues>({
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  //내부 이탈 방지
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (isDirty && url.split('?')[0] !== router.asPath.split('?')[0]) {
        setIsModalOpen(true);
        setNextRoute(url);
        router.events.emit('routeChangeError'); //강제로 에러 던져서 이동 중지
        throw 'routeChange aborted.';
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  }, [isDirty, router]);
  // 브라우저 새로고침 및 탭 닫기 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    // 변경사항이 있을 때만
    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // 모달에서 저장 안 하고 이동
  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    if (nextRoute) {
      reset(undefined, { keepValues: true, keepDirty: false });
      setTimeout(() => {
        router.push(nextRoute);
      }, 0);
    }
  };

  const onSubmit = (data: AccountFormValues) => {
    updateProfile(
      { nickname: data.name },
      {
        onSuccess: () => {
          reset({ name: data.name }); // 초기화
          toast.success('이름이 성공적으로 변경되었습니다.');
        },
      },
    );
  };

  const closeModal = () => setIsModalOpen(false);

  return {
    user,
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    isPending,
    isModalOpen,
    closeModal,
    handleConfirmLeave,
    onSubmit,
  };
}
