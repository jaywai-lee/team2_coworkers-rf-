import { useState } from 'react';
import { Article } from '../model/entities/article.model';
import { IconHeartEmpty } from '@/shared/ui/icons/IconHeartEmpty';
import { IconBest } from '@/shared/ui/icons/IconBest';
import Link from 'next/link';
import { formatDate } from '@/shared/lib/date';
import Image from 'next/image';
interface Props {
  article: Article;
  variant?: 'default' | 'best';
}

export function ArticleCard({ article, variant }: Props) {
  const [isError, setIsError] = useState(false);

  const isBest = variant === 'best';

  return (
    <Link
      href={`/boards/${article.id}`}
      className={
        isBest
          ? 'h-51.25 w-85 rounded-xl border border-slate-200 bg-white px-5 py-6'
          : 'h-39 rounded-xl border border-slate-200 px-6 py-5'
      }
    >
      {isBest && (
        <div className="flex h-7.5 w-18 items-center justify-center gap-1 rounded-full bg-slate-100 text-blue-500">
          <IconBest />
          <span className="text-sm font-bold">인기</span>
        </div>
      )}

      <div className={isBest ? 'mt-4 flex' : 'flex justify-between'}>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold">{article.title}</h3>

          <p
            className={
              isBest
                ? 'line-clamp-2 pt-2 text-sm text-slate-500'
                : 'line-clamp-2 pt-3 text-sm text-slate-500'
            }
          >
            {article.content}
          </p>
        </div>
        {article.image && (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 md:h-22 md:w-22 lg:h-15 lg:w-15">
            {!isError ? (
              <Image
                src={article.image}
                loading="lazy"
                alt={article.title}
                className="object-cover"
                sizes="(max-width: 768px) 80px, (max-width: 1024px) 88px, 60px"
                fill
                onError={() => setIsError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                이미지 오류
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="flex justify-between pt-4">
        <div className="flex gap-2 text-sm font-medium">
          <span>{article.writer.nickname}</span>
          <span>|</span>
          <time className="text-gray-400">{formatDate(article.createdAt)}</time>
        </div>

        <div className="flex items-center gap-1">
          <IconHeartEmpty size={16} />
          <span className="text-sm text-gray-400">{article.likeCount}</span>
        </div>
      </footer>
    </Link>
  );
}
