import { KeyboardEvent, useState } from 'react';
import { TaskCommonParams } from '../../model/params/task.params';
import { toast } from 'sonner';
import { IconClose } from '@/shared/ui/icons';
import { useCreateTaskMutation } from '../../hooks/useCreateTaskMutation';
import { CreateTaskParams } from '../../model/params/task.create.params';
import axios from 'axios';

interface AiTaskPreview {
  title: string;
  date?: string;
  time?: string;
  // 💡 [추후 확장 포인트] AI 프롬프트에 반복 여부를 파악하게 한 뒤 아래 필드를 추가받습니다.
  // frequencyType?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  // monthDay?: number;
  // weekDays?: number[];
}

interface AiTaskInputProps {
  params: TaskCommonParams;
  onCancel: () => void;
  currentDate?: string;
}

export default function AiTaskInput({ params, onCancel, currentDate }: AiTaskInputProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<AiTaskPreview | null>(null);

  const { mutateAsync: createTask } = useCreateTaskMutation({ ...params, date: currentDate });

  const handleAiParse = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const realToday = new Date().toISOString();

      const response = await axios.post('/api/task-ai', {
        userInput: inputText,
        realToday: realToday,
        selectedDate: currentDate,
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

      const payload: CreateTaskParams = {
        name: previewData.title,
        frequencyType: 'ONCE',
        startDate,
      };

      await createTask(payload);

      onCancel();
    } catch (error) {
      toast.error('할 일을 생성하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700">
          <span>✨</span> 자연어로 간편하게 일정을 만들어보세요
        </h3>
        <button
          onClick={onCancel}
          aria-label="닫기"
          className="text-gray-400 transition-colors hover:text-gray-700"
        >
          <IconClose size={20} />
        </button>
      </div>

      {!previewData && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 내일 오전 11시에 디자이너 미팅 추가해줘"
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAiParse}
            disabled={isLoading || !inputText.trim()}
            className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isLoading ? '분석 중...' : '분석하기'}
          </button>
        </div>
      )}

      {isLoading && !previewData && (
        <div className="mt-1 animate-pulse text-sm text-indigo-600">
          AI가 문맥을 분석하고 있습니다...
        </div>
      )}

      {previewData && (
        <div className="flex flex-col gap-3 rounded-md border border-white bg-white p-4 shadow-sm">
          <div className="text-sm">
            <p className="mb-1 text-gray-500">이렇게 추가할까요?</p>
            <div className="text-base font-medium text-gray-800">{previewData.title}</div>
            {(previewData.date || previewData.time) && (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
                {previewData.date && <span>📅 {previewData.date}</span>}
                {previewData.time && <span>🕒 {previewData.time}</span>}
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPreviewData(null)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              수정/다시 입력
            </button>
            <button
              type="button"
              onClick={handleConfirmCreate}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              이대로 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
