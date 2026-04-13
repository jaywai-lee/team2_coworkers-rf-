import { useModal } from '@/shared/hooks/useModal';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/input/Input';
import { Modal } from '@/shared/ui/modal';
import { FormField } from '@/shared/ui/formfield';
import { AUTH_VALIDATION_RULES } from '../utils/validation';
import { useSendResetEmailForm } from '../hooks/useSendResetEmailForm';

export function SendResetEmailModal() {
  const { isOpen, open, close } = useModal();
  const { register, onSubmit, errors, isSubmitting, handleClose } = useSendResetEmailForm(close);

  return (
    <Modal isOpen={isOpen} open={open} close={handleClose}>
      <Modal.Trigger asChild>
        <button
          type="button"
          className="text-brand-primary hover:text-interaction-hover text-md cursor-pointer font-medium underline md:text-lg"
        >
          비밀번호를 잊으셨나요?
        </button>
      </Modal.Trigger>
      <Modal.Content showCloseButton={false} size="sm" className="px-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit(e);
          }}
        >
          <Modal.Header>
            <Modal.Title>비밀번호 재설정</Modal.Title>
            <Modal.Description className="text-md text-slate-400">
              비밀번호 재설정 링크를 보내드립니다.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body className="mt-2">
            <FormField isInvalid={!!errors.email}>
              <FormField.Control>
                <Input
                  type="email"
                  disabled={isSubmitting}
                  autoFocus
                  placeholder="이메일을 입력하세요."
                  {...register('email', AUTH_VALIDATION_RULES.email)}
                  className="placeholder:text-txt-default placeholder:text-lg placeholder:font-normal"
                />
              </FormField.Control>
              <FormField.Message>{errors.email?.message}</FormField.Message>
            </FormField>
          </Modal.Body>

          <Modal.Footer className="justify-center gap-2">
            <Modal.Close asChild>
              <Button type="button" size="lg" variant="outline" className="flex-1">
                닫기
              </Button>
            </Modal.Close>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '전송 중...' : '링크 보내기'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}
