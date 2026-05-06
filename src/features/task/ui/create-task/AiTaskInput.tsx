import { useIsMobileOrTablet } from '@/shared/hooks/useIsMobileOrTablet';
import { useAiTask } from '../../hooks/useAiTask';
import { TaskCommonParams } from '../../model/params/task.params';
import { IconClose } from '@/shared/ui/icons';

interface AiTaskInputProps {
  params: TaskCommonParams;
  onCancel: () => void;
  currentDate?: string;
}

const getFrequencyLabel = (freq: string) => {
  switch (freq) {
    case 'DAILY':
      return '매일';
    case 'WEEKLY':
      return '매주';
    case 'MONTHLY':
      return '매월';
    default:
      return null;
  }
};

export default function AiTaskInput({ params, onCancel, currentDate }: AiTaskInputProps) {
  const {
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
  } = useAiTask({ params, currentDate, onSuccess: onCancel });

  const isMobileOrTablet = useIsMobileOrTablet();

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
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? '듣고 있습니다... 말씀해 주세요!'
                  : isMobileOrTablet
                    ? '예: 내일 오전 11시 미팅'
                    : '예: 내일 오전 11시에 디자이너 미팅 추가해줘'
              }
              disabled={isLoading || isListening}
              className={`w-full rounded-md border py-2 pr-12 pl-3 text-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:text-gray-400 ${
                isListening
                  ? 'border-indigo-500 bg-indigo-50 shadow-inner'
                  : 'border-gray-300 disabled:bg-gray-100'
              }`}
              autoFocus
            />

            {isSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                title="음성으로 입력하기"
                className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 transition-all ${
                  isListening
                    ? 'animate-pulse bg-red-100 text-red-600'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )}
          </div>
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
            <div className="flex items-center gap-2 text-base font-medium text-gray-800">
              {previewData.title}
              {previewData.frequencyType !== 'ONCE' && (
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {getFrequencyLabel(previewData.frequencyType)}
                </span>
              )}
            </div>
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
              onClick={clearPreview}
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
