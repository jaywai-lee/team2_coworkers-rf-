import { Button } from '@/shared/ui/Button/Button';
import { FormField } from '@/shared/ui/formfield';
import { IconArrowLeft } from '@/shared/ui/icons/IconArrowLeft';
import { ImagePreviewList } from '@/shared/ui/imagePicker/ImagePreviewList';
import { ImageUploadSlot } from '@/shared/ui/imagePicker/ImageUploadSlot';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ImageItem = { type: 'file'; file: File } | { type: 'url'; url: string };

type Props = {
  initialTitle?: string;
  initialContent?: string;
  initialImages?: ImageItem[];
  onSubmit: (data: { title: string; content: string; images: ImageItem[] }) => void;
  mode?: 'create' | 'edit';
};

type FormValues = {
  title: string;
  content: string;
};

export function ArticleForm({
  initialTitle = '',
  initialContent = '',
  initialImages = [],
  onSubmit,
  mode = 'create',
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialTitle,
      content: initialContent,
    },
    mode: 'onSubmit',
  });

  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const MAX_COUNT = 5;

  const handleUpload = (files: FileList) => {
    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      type: 'file',
      file,
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, MAX_COUNT));
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = (data: FormValues) => {
    onSubmit({
      ...data,
      images,
    });
    reset({
      title: '',
      content: '',
    });

    setImages([]);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex min-h-screen items-start justify-center bg-gray-100 p-6"
    >
      <div className="relative w-full max-w-225 rounded-2xl bg-white shadow-xl">
        <Link
          href="/boards"
          className="flex items-center gap-1 px-3 pt-6 text-slate-400 hover:text-slate-600 md:px-8"
        >
          <IconArrowLeft size={24} />
        </Link>

        <div className="px-6 pb-6 md:p-5 md:px-18 md:pt-5 md:pb-18">
          <h2 className="mb-4 pt-3 text-xl font-bold md:pt-5">
            {mode === 'edit' ? '게시글 수정' : '게시글 쓰기'}
          </h2>

          <div className="mt-10 mb-4">
            <FormField isInvalid={!!errors.title}>
              <FormField.Label>
                제목 <span className="text-red-500">*</span>
              </FormField.Label>

              <FormField.Control>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  {...register('title', {
                    required: '제목을 입력해주세요.',
                    validate: (value) => value.trim() !== '' || '제목을 입력해주세요.',
                  })}
                  className="text-txt-default mt-3 h-12 w-full rounded-lg border border-slate-200 px-3 py-2 text-lg"
                />
              </FormField.Control>

              <FormField.Message>{errors.title?.message}</FormField.Message>
            </FormField>
          </div>

          <div className="mt-9 mb-4">
            <FormField isInvalid={!!errors.content}>
              <FormField.Label>
                내용 <span className="text-red-500">*</span>
              </FormField.Label>

              <FormField.Control>
                <textarea
                  rows={5}
                  placeholder="내용을 입력하세요"
                  {...register('content', {
                    required: '내용을 입력해주세요.',
                    validate: (value) => value.trim() !== '' || '내용을 입력해주세요.',
                  })}
                  className="text-txt-default mt-3 h-50 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-lg md:h-60"
                />
              </FormField.Control>

              <FormField.Message>{errors.content?.message}</FormField.Message>
            </FormField>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-lg font-bold">이미지</label>

            <div className="mt-3 flex flex-wrap gap-2">
              <ImageUploadSlot
                disabled={images.length >= MAX_COUNT}
                onUpload={handleUpload}
                count={images.length}
                maxCount={MAX_COUNT}
              />

              <ImagePreviewList images={images} onRemove={handleRemove} />
            </div>
          </div>

          <Button type="submit" className="mt-14 h-12 w-full rounded-[12px]">
            {mode === 'edit' ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </div>
    </form>
  );
}
