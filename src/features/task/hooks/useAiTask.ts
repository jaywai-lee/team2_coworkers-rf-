import { KeyboardEvent, useState } from 'react';
import { TaskCommonParams } from '../model/params/task.params';
import { useCreateTaskMutation } from './useCreateTaskMutation';
import { useSpeechRecognition } from '@/shared/hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { CreateRecurringParams, CreateTaskParams } from '../model/params/task.create.params';
import axios from 'axios';

interface AiTaskPreview {
  title: string;
  date?: string;
  time?: string;
  frequencyType: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  weekDays?: number[];
  monthDay?: number;
}

interface UseAiTaskProps {
  params: TaskCommonParams;
  currentDate?: string;
  onSuccess: () => void;
}

export const useAiTask = ({ params, currentDate, onSuccess }: UseAiTaskProps) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<AiTaskPreview | null>(null);

  const { mutateAsync: createTask } = useCreateTaskMutation({ ...params, date: currentDate });

  const { isListening, isSupported, startListening } = useSpeechRecognition();

  const handleMicClick = () => {
    if (isListening) return;

    startListening((transcript) => {
      setInputText(transcript);
    });
  };

  const handleAiParse = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const now = new Date();
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const realTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} (${days[now.getDay()]}요일)`;

      let calendarReference = '';
      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        calendarReference += `[${days[d.getDay()]}요일] -> ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}\n`;
      }

      const response = await axios.post('/api/task-ai', {
        userInput: inputText,
        realToday: realTodayStr,
        selectedDate: currentDate,
        calendarReference,
      });

      setPreviewData(response.data);
    } catch (error) {
      toast.error('일정을 분석하는 데 실패했습니다. 다시 시도해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleAiParse();
    }
  };

  const handleConfirmCreate = async () => {
    if (!previewData) return;

    try {
      let startDate: Date | undefined;

      if (previewData.date) {
        const dateTimeStr = previewData.time
          ? `${previewData.date}T${previewData.time}:00`
          : `${previewData.date}T00:00:00`;
        startDate = new Date(dateTimeStr);
      }

      if (previewData.frequencyType === 'ONCE') {
        const payload: CreateTaskParams = {
          name: previewData.title,
          frequencyType: 'ONCE',
          startDate,
        };
        await createTask(payload);
      } else if (previewData.frequencyType === 'WEEKLY') {
        const payload: CreateRecurringParams = {
          name: previewData.title,
          frequencyType: 'WEEKLY',
          startDate: startDate || new Date(),
          weekDays: previewData.weekDays,
        };
        await createTask(payload);
      } else if (previewData.frequencyType === 'MONTHLY') {
        const payload: CreateRecurringParams = {
          name: previewData.title,
          frequencyType: 'MONTHLY',
          startDate: startDate || new Date(),
          monthDay: previewData.monthDay,
        };
        await createTask(payload);
      } else if (previewData.frequencyType === 'DAILY') {
        const payload: CreateRecurringParams = {
          name: previewData.title,
          frequencyType: 'DAILY',
          startDate: startDate || new Date(),
        };
        await createTask(payload);
      }
      onSuccess();
    } catch (error) {
      toast.error('할 일을 생성하는 중 문제가 발생했습니다.');
    }
  };

  const clearPreview = () => setPreviewData(null);

  return {
    inputText,
    setInputText,
    isLoading,
    previewData,
    isListening,
    isSupported,
    handleMicClick,
    handleAiParse,
    handleKeyDown,
    handleConfirmCreate,
    clearPreview,
  };
};
