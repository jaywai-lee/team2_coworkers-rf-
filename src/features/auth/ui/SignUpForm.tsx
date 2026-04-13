import { FormField } from '@/shared/ui/formfield';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { Input } from '@/shared/ui/input/Input';
import { AUTH_VALIDATION_RULES, validatePasswordMatch } from '../utils/validation';
import { Button } from '@/shared/ui/Button/Button';
import { KakaoAuthButton } from './KakaoAuthButton';
import Link from 'next/link';
import { getKakaoAuthUrl } from '../utils/getKakaoAuthUrl';

export function SignUpForm() {
  const { register, onSubmit, errors, isSubmitting } = useSignUpForm();

  const handleKakaoLogin = () => {
    window.location.href = getKakaoAuthUrl();
  };

  return (
    <div className="w-full rounded-2xl bg-white px-5 py-12 shadow-sm md:px-10">
      <h1 className="text-txt-primary mb-10 text-center text-xl font-bold md:text-2xl">회원가입</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FormField isInvalid={!!errors.nickname}>
          <FormField.Label>이름</FormField.Label>
          <FormField.Control>
            <Input
              type="text"
              placeholder="이름을 입력해주세요."
              {...register('nickname', AUTH_VALIDATION_RULES.nickname)}
              className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
            />
          </FormField.Control>
          <FormField.Message>{errors.nickname?.message}</FormField.Message>
        </FormField>

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

        <FormField isInvalid={!!errors.password}>
          <FormField.Label>비밀번호</FormField.Label>
          <FormField.Control>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              {...register('password', {
                ...AUTH_VALIDATION_RULES.password,
                deps: ['passwordConfirmation'],
              })}
              className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
            />
          </FormField.Control>
          <FormField.Message>{errors.password?.message}</FormField.Message>
        </FormField>

        <FormField isInvalid={!!errors.passwordConfirmation}>
          <FormField.Label>비밀번호 확인</FormField.Label>
          <FormField.Control>
            <Input
              type="password"
              placeholder="비밀번호를 다시 한 번 입력해주세요."
              {...register('passwordConfirmation', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: validatePasswordMatch,
              })}
              className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
            />
          </FormField.Control>
          <FormField.Message>{errors.passwordConfirmation?.message}</FormField.Message>
        </FormField>

        <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="mt-2">
          {isSubmitting ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <div className="text-txt-primary text-md mt-5 mb-0 text-center font-medium md:text-lg">
        이미 회원이신가요?
        <Link
          href="/login"
          className="text-brand-primary hover:text-interaction-hover ml-3 font-medium underline"
        >
          로그인하기
        </Link>
      </div>

      <div className="mt-8 mb-6 flex items-center justify-center gap-6">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="text-txt-default text-md font-normal md:text-lg">간편 회원가입하기</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      <KakaoAuthButton onClick={handleKakaoLogin} />
    </div>
  );
}
