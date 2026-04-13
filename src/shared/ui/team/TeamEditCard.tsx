import { useEffect } from 'react';
import { FormField } from '@/shared/ui/formfield';
import { Input } from '@/shared/ui/input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import { useForm } from 'react-hook-form';

export interface TeamEditFormValues {
  name: string;
}

export interface TeamEditCardProps {
  defaultName: string;
  onSubmit?: (values: TeamEditFormValues) => void | Promise<void>;
  className?: string;
}

export function TeamEditCard({ defaultName, onSubmit, className }: TeamEditCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamEditFormValues>({
    defaultValues: { name: defaultName },
  });

  useEffect(() => {
    reset({ name: defaultName });
  }, [defaultName, reset]);

  return (
    <div
      className={cn(
        'bg-background-primary w-full max-w-[460px] rounded-2xl px-8 py-10 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12',
        className,
      )}
    >
      <h2 className="text-txt-primary text-2xl font-bold tracking-tight">팀 수정하기</h2>

      <form
        className="mt-8 flex flex-col gap-8"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit?.(values);
        })}
        noValidate
      >
        <FormField isInvalid={!!errors.name} className="gap-2 md:gap-2">
          <FormField.Label className="text-txt-secondary text-sm font-medium">
            팀 이름
          </FormField.Label>
          <FormField.Control>
            <Input
              type="text"
              autoComplete="off"
              placeholder="닉네임 또는 팀 이름을 입력해주세요."
              {...register('name', {
                required: '팀 이름을 입력해주세요.',
              })}
              className="placeholder:text-txt-default placeholder:text-md rounded-[10px] placeholder:font-normal"
            />
          </FormField.Control>
          <FormField.Message>{errors.name?.message}</FormField.Message>
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-[10px] text-base font-bold"
        >
          {isSubmitting ? '처리 중...' : '수정하기'}
        </Button>
      </form>
    </div>
  );
}
