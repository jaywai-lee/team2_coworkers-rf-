import { set } from 'date-fns';
import { TaskFormValues, ValidTaskFormValues } from './taskForm.types';

type Time = string;

export function combineDateTime(date: Date, time: Time): Date {
  const [hours, minutes] = time.split(':').map(Number);

  return set(date, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
}

export function isValidTaskForm(data: TaskFormValues): data is ValidTaskFormValues {
  return Boolean(data.dateTime?.date && data.dateTime?.time);
}
