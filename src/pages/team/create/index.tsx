import { GlobalLayout } from '@/widgets/layout/GlobalLayout';
import { TeamCreateCard } from '@/shared/ui/team/TeamCreateCard';
import { teamDashboardPath } from '@/shared/constants/routes';
import { useCreateGroupMutation } from '@/features/group/hooks/useCreateGroupMutation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { toast } from 'sonner';
import { isApiError } from '@/shared/api/mapApiError';

export default function TeamCreatePage() {
  const router = useRouter();
  const { mutateAsync } = useCreateGroupMutation();

  return (
    <>
      <Head>
        <title>팀 생성하기 | Coworkers</title>
        <meta name="description" content="새 팀을 만들고 멤버를 초대하세요." />
      </Head>

      <div className="absolute inset-0 box-border flex flex-col items-center justify-center overflow-y-auto bg-[#F4F7F9] px-4 py-8 sm:px-6">
        <TeamCreateCard
          className="shrink-0"
          onSubmit={async ({ name, image }) => {
            const trimmedImage = image.trim();
            try {
              const created = await mutateAsync({
                body: {
                  name: name.trim(),
                  ...(trimmedImage ? { image: trimmedImage } : {}),
                },
              });
              toast.success('팀이 생성되었습니다.');
              await router.push(teamDashboardPath(String(created.id)));
            } catch (error: unknown) {
              const errorMessage = isApiError(error)
                ? error.message
                : error instanceof Error
                  ? error.message
                  : '팀 생성에 실패했습니다.';

              toast.error(errorMessage);
            }
          }}
        />
      </div>
    </>
  );
}

TeamCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <GlobalLayout>{page}</GlobalLayout>;
};
