import { FormField } from '@/shared/ui/formfield';
import { useAuthForm } from '../hooks/useAuthForm';
import { Input } from '@/shared/ui/input/Input';
import { AUTH_VALIDATION_RULES } from '../utils/validation';
import { Button } from '@/shared/ui/Button/Button';
import Link from 'next/link';
import { SendResetEmailModal } from './SendResetEmailModal';
import { KakaoAuthButton } from './KakaoAuthButton';
import { getKakaoAuthUrl } from '../utils/getKakaoAuthUrl';

export function LoginForm() {
  const { register, onSubmit, errors, isSubmitting } = useAuthForm();

  const handleKakaoLogin = () => {
    window.location.href = getKakaoAuthUrl();
  };

  return (
    <div className="w-full rounded-2xl bg-white px-5 py-12 shadow-sm md:px-10">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FormField isInvalid={!!errors.email}>
          <FormField.Label>이메일</FormField.Label>
          <FormField.Control>
            <Input
              type="email"
              placeholder="이메일을 입력해주세요."
              {...register('email', AUTH_VALIDATION_RULES.email)}
              className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
            />
          </FormField.Control>
          <FormField.Message>{errors.email?.message}</FormField.Message>
        </FormField>

        <div className="flex flex-col gap-2">
          <FormField isInvalid={!!errors.password}>
            <FormField.Label>비밀번호</FormField.Label>
            <FormField.Control>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                {...register('password', AUTH_VALIDATION_RULES.password)}
                className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
              />
            </FormField.Control>
            <FormField.Message>{errors.password?.message}</FormField.Message>
          </FormField>

          <div className="mt-1 flex justify-end">
            <SendResetEmailModal />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="mt-2">
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="text-txt-primary text-md mt-5 mb-0 text-center font-medium md:text-lg">
        아직 계정이 없으신가요?
        <Link
          href="/signup"
          className="text-brand-primary hover:text-interaction-hover ml-3 font-medium underline"
        >
          가입하기
        </Link>
      </div>

      <div className="mt-8 mb-6 flex items-center justify-center gap-6">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="text-txt-default text-md font-normal md:text-lg">간편 로그인하기</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      <KakaoAuthButton onClick={handleKakaoLogin} />
    </div>
  );
}
