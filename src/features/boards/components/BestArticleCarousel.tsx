import { ArticleCard } from '@/features/boards/components/ArticleCard';
import { IconArrowLeft } from '@/shared/ui/icons/IconArrowLeft';
import { IconArrowRight } from '@/shared/ui/icons/IconArrowRight';
import { Article } from '@/features/boards/model/entities/article.model';
import { useState } from 'react';

type BestArticleCarouselProps = {
  best: {
    visibleBest: Article[];
    current: number;
    total: number;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
  };
  onPrev: () => void;
  onNext: () => void;
  onSwipe: (diff: number) => void;
};

export function BestArticleCarousel({ best, onPrev, onNext, onSwipe }: BestArticleCarouselProps) {
  const [startX, setStartX] = useState<number | null>(null);

  const THRESHOLD = 50;

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;

    const diff = e.clientX - startX;

    if (Math.abs(diff) > THRESHOLD) {
      onSwipe(diff);
    }

    setStartX(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;

    if (Math.abs(diff) > THRESHOLD) {
      onSwipe(diff);
    }
    setStartX(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="mx-auto px-6 select-none"
    >
      <h2 className="px-4 text-xl font-bold md:px-2">베스트 게시글</h2>
      <div className="flex justify-center gap-4 pt-6">
        {best.visibleBest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="best" />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 items-center">
        <div />
        <div className="flex justify-center gap-2">
          {Array.from({ length: best.total }).map((_, i) => (
            <button
              key={i}
              onClick={() => best.setCurrent(i)}
              className="flex cursor-pointer items-center justify-center rounded-full"
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  best.current === i ? 'w-4 bg-slate-400' : 'bg-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 pr-6">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white"
            onClick={onPrev}
          >
            <IconArrowLeft size={16} />
          </button>
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white"
            onClick={onNext}
          >
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
