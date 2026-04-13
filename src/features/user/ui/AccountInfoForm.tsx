import { FormField } from '@/shared/ui/formfield';
import { Input } from '@/shared/ui/input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { PasswordChangeModal } from './PasswordChangeModal';
import { AccountDeleteModal } from './AccountDeleteModal';
import { cn } from '@/shared/lib/cn';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { useAccountForm } from '../hooks/useAccountForm';
import { IconCheck } from '@/shared/ui/icons';

export function AccountInfoForm() {
  const {
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
  } = useAccountForm();

  return (
    <>
      <div className={cn('flex flex-col gap-6', 'w-75', 'md:w-115', 'xl:w-198')}>
        <form id="accountNameForm" onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormField.Label className="text-sm font-semibold">이름</FormField.Label>
            <FormField.Control>
              <Input
                placeholder="이름을 입력해주세요"
                isInvalid={!!errors.name}
                {...register('name', { required: '이름은 필수 입력입니다.' })}
              />
            </FormField.Control>
          </FormField>
        </form>

        <FormField>
          <FormField.Label className="text-sm font-semibold">이메일</FormField.Label>
          <FormField.Control>
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-background-secondary border-border-primary text-txt-disabled cursor-not-allowed border"
            />
          </FormField.Control>
        </FormField>

        <FormField>
          <FormField.Label className="text-sm font-semibold">비밀번호</FormField.Label>
          <FormField.Control>
            <Input
              type="text"
              value="••••••••"
              disabled
              className="bg-background-secondary border-border-primary text-txt-disabled cursor-not-allowed border"
              rightElement={<PasswordChangeModal />}
            />
          </FormField.Control>
        </FormField>

        <div className="mt-4 flex w-full items-center justify-between">
          <AccountDeleteModal />
          <Button
            form="accountNameForm"
            type="submit"
            variant="outline"
            size="lg"
            leftIcon={<IconCheck className="h-4.5 w-4.5 transition-colors md:h-5 md:w-5" />}
            className={cn('border-none', 'p-0', 'text-brand-primary text-md md:text-lg')}
            disabled={!isDirty || !isValid || isPending}
          >
            {isPending ? '저장 중...' : '변경사항 저장하기'}
          </Button>
        </div>
      </div>
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirmLeave={handleConfirmLeave}
      />
    </>
  );
}
