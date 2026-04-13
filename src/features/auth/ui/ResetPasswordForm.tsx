import { FormField } from '@/shared/ui/formfield';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import { Input } from '@/shared/ui/input/Input';
import { AUTH_VALIDATION_RULES, validatePasswordMatch } from '../utils/validation';
import { Button } from '@/shared/ui/Button/Button';

interface ResetPasswordProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordProps) {
  const { register, onSubmit, errors, isSubmitting } = useResetPasswordForm(token);

  return (
    <div className="w-full rounded-2xl bg-white px-5 py-12 shadow-sm md:px-10">
      <h1 className="text-txt-primary mb-10 text-center text-xl font-bold md:text-2xl">
        새 비밀번호 설정
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FormField isInvalid={!!errors.password}>
          <FormField.Label>새 비밀번호</FormField.Label>
          <FormField.Control>
            <Input
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
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
          <FormField.Label>새 비밀번호 확인</FormField.Label>
          <FormField.Control>
            <Input
              type="password"
              placeholder="새 비밀번호를 다시 한 번 입력해주세요."
              {...register('passwordConfirmation', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: validatePasswordMatch,
              })}
              className="placeholder:text-txt-default placeholder:text-md placeholder:font-normal md:placeholder:text-lg"
            />
          </FormField.Control>
          <FormField.Message>{errors.passwordConfirmation?.message}</FormField.Message>
        </FormField>

        <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="mt-4">
          {isSubmitting ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
    </div>
  );
}
