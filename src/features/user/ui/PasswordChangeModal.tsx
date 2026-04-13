import { useForm } from 'react-hook-form';
import { Modal, useModal } from '@/shared/ui/modal';
import { FormField } from '@/shared/ui/formfield';
import { Input } from '@/shared/ui/input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { AUTH_VALIDATION_RULES } from '@/features/auth/utils/validation';
import { useUpdatePasswordMutation } from '../hooks/useUpdatePasswordMutation';

interface PasswordFormValues {
  newPassword: string;
  newPasswordCheck: string;
}
export function PasswordChangeModal() {
  const { isOpen, open, close } = useModal();

  const { mutate: changePassword, isPending } = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<PasswordFormValues>({ mode: 'onChange' });

  const onSubmit = (data: PasswordFormValues) => {
    changePassword(
      { password: data.newPassword, passwordConfirmation: data.newPasswordCheck },
      {
        onSuccess: () => {
          close();
          reset();
        },
      },
    );
  };

  const handleClose = () => {
    close();
    reset();
  };

  return (
    <Modal isOpen={isOpen} open={open} close={handleClose}>
      <Modal.Trigger asChild>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={open}
          className="w-18.5 font-['Pretendard'] text-[14px] font-semibold whitespace-nowrap"
        >
          변경하기
        </Button>
      </Modal.Trigger>

      <Modal.Content size="md" showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="pt-8 pb-4">
            <Modal.Title className="text-txt-primary w-full text-center text-lg font-bold">
              비밀번호 변경하기
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-5 px-4 sm:px-6">
            <FormField>
              <FormField.Label className="text-sm font-semibold">새 비밀번호</FormField.Label>
              <FormField.Control>
                <Input
                  type="password"
                  placeholder="새 비밀번호를 입력해주세요."
                  isInvalid={!!errors.newPassword}
                  {...register('newPassword', AUTH_VALIDATION_RULES.password)}
                />
              </FormField.Control>
              {errors.newPassword && (
                <p className="text-status-danger mt-1 text-xs font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </FormField>

            <FormField>
              <FormField.Label className="text-sm font-semibold">새 비밀번호 확인</FormField.Label>
              <FormField.Control>
                <Input
                  type="password"
                  placeholder="새 비밀번호를 다시 한 번 입력해주세요."
                  isInvalid={!!errors.newPasswordCheck}
                  {...register('newPasswordCheck', {
                    required: '비밀번호 확인은 필수입니다.',
                    validate: (value) =>
                      value === getValues('newPassword') || '비밀번호가 일치하지 않습니다.',
                  })}
                />
              </FormField.Control>
              {errors.newPasswordCheck && (
                <p className="text-status-danger mt-1 text-xs font-medium">
                  {errors.newPasswordCheck.message}
                </p>
              )}
            </FormField>
          </Modal.Body>

          <Modal.Footer className="flex w-full gap-2 px-4 pt-6 pb-8 sm:px-6">
            <Modal.Close asChild>
              <Button
                variant="outline"
                size="lg"
                className="text-txt-secondary flex-1"
                aria-label="비밀번호 변경 모달 닫기"
              >
                닫기
              </Button>
            </Modal.Close>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!isDirty || !isValid || isPending}
            >
              {isPending ? '변경 중...' : '변경하기'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}
