import { useRouter } from 'next/router';
import { SignUpRequest } from '../model/dto/auth.dto';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSignUp } from './useSignUp';
import { getRedirectQuery } from '../utils/getRedirectQuery';

export function useSignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequest>({ mode: 'onSubmit' });

  const { mutate: signUp, isPending } = useSignUp();

  const submitHandler = (data: SignUpRequest) => {
    signUp(data, {
      onSuccess: (user) => {
        toast.success(`${user.name}님 환영합니다!`);
        const returnUrl = getRedirectQuery(router.query.redirect);
        router.push(returnUrl);
      },
      onError: (error) => {
        toast.error(error.message || '회원가입에 실패했습니다.');
      },
    });
  };

  return {
    register,
    onSubmit: handleSubmit(submitHandler),
    errors,
    isSubmitting: isPending,
  };
}
