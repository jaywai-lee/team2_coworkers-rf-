import { Input } from '@/shared/ui/input/Input';
import { FormField } from '@/shared/ui/formfield';
import { Button } from '@/shared/ui/Button/Button';
import RecurrenceField from '../../components/recurrenceField';
import { Controller, useForm } from 'react-hook-form';
import { TaskFormValues } from './taskForm.types';
import DateTimeField from '../../dateTimeField/dateTimeField';
import { InputBox } from '@/shared/ui/input/InputBox';
import { useEffect } from 'react';

type Props = {
  initialValues: TaskFormValues;
  onSubmit: (data: TaskFormValues) => void;
  isPending: boolean;
};

export default function TaskForm({ initialValues, onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<TaskFormValues>({ mode: 'onChange', defaultValues: initialValues });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const submitHandler = (data: TaskFormValues) => {
    onSubmit(data);
  };

  const isEditMode = Boolean(initialValues?.title);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-txt-primary text-lg">
          {isEditMode ? '할 일 수정하기' : '할 일 만들기'}
        </h2>
        <p className="text-md text-txt-default">
          할 일은 실제로 행동 가능한 작업 중심으로
          <br />
          작성해주시면 좋습니다.
        </p>
      </div>

      <FormField>
        <FormField.Label>할 일 제목</FormField.Label>
        <FormField.Control>
          <Input
            {...register('title', {
              required: '제목을 입력해주세요.',
            })}
          />
        </FormField.Control>
        <FormField.Message>{errors.title?.message}</FormField.Message>
      </FormField>

      <FormField>
        <FormField.Label>시작 날짜 및 시간</FormField.Label>
        <Controller
          control={control}
          name="dateTime"
          rules={{
            validate: (value) => {
              if (!value?.date || !value?.time) {
                return '날짜와 시간을 모두 입력해주세요.';
              }
              return true;
            },
          }}
          render={({ field }) => <DateTimeField value={field.value} onChange={field.onChange} />}
        />
        <FormField.Message>{errors.dateTime?.message}</FormField.Message>
      </FormField>

      <Controller
        control={control}
        name="recurrence"
        render={({ field: recurrenceField }) => (
          <Controller
            control={control}
            name="selectedDays"
            rules={{
              validate: (value) => {
                if (recurrenceField.value === 'WEEKLY' && value.length === 0) {
                  return '요일을 선택해주세요.';
                }
                return true;
              },
            }}
            render={({ field: daysField }) => (
              <FormField>
                <FormField.Label>반복 설정</FormField.Label>
                <RecurrenceField
                  value={recurrenceField.value}
                  onChange={(v) => {
                    recurrenceField.onChange(v);

                    if (v !== 'WEEKLY') {
                      daysField.onChange([]);
                    }
                  }}
                  selectedDays={daysField.value ?? []}
                  onChangeDays={daysField.onChange}
                />
                <FormField.Message>{errors.selectedDays?.message}</FormField.Message>
              </FormField>
            )}
          />
        )}
      />

      <FormField>
        <FormField.Label>할 일 메모</FormField.Label>
        <FormField.Control>
          <InputBox {...register('description')} />
        </FormField.Control>
      </FormField>

      <Button type="submit" disabled={!isValid || isPending}>
        {isPending && <span className="loading loading-spinner" />}
        {isEditMode ? '수정하기' : '만들기'}
      </Button>
    </form>
  );
}
