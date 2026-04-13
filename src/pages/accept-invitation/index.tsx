import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAcceptInvitationMutation } from '@/features/group/hooks/useAcceptInvitationMutation';
import { parseInvitationToken } from '@/features/group/lib/parseInvitationToken';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { teamDashboardPath, ROUTES } from '@/shared/constants/routes';
import { GlobalLayout } from '@/widgets/layout/GlobalLayout';
import { FormField } from '@/shared/ui/formfield';
import { Input } from '@/shared/ui/input/Input';
import { Button } from '@/shared/ui/Button/Button';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const { data: user, isPending: isUserPending } = useUserQuery();
  const [teamLink, setTeamLink] = useState('');

  const { mutate, isPending } = useAcceptInvitationMutation({
    onSuccess: async (data) => {
      await router.push(teamDashboardPath(String(data.groupId)));
    },
    onError: () => {},
  });

  const rawToken = router.query.token;
  const queryTokenFromRouter =
    typeof rawToken === 'string' ? rawToken : Array.isArray(rawToken) ? rawToken[0] : undefined;

  useEffect(() => {
    if (!router.isReady || !queryTokenFromRouter) return;
    setTeamLink(
      `${window.location.origin}/accept-invitation?token=${encodeURIComponent(queryTokenFromRouter)}`,
    );
  }, [router.isReady, queryTokenFromRouter]);

  const postLoginRedirectPath = (): string => {
    const token = queryTokenFromRouter ?? parseInvitationToken(teamLink);
    if (token) {
      return `${ROUTES.ACCEPT_INVITATION}?token=${encodeURIComponent(token)}`;
    }
    return ROUTES.ACCEPT_INVITATION;
  };

  const canJoinWithSession = Boolean(user?.email);
  const isSubmitDisabled = isPending || isUserPending || !canJoinWithSession;

  const handleJoin = () => {
    if (!user?.email) {
      return;
    }
    const invitationToken =
      (typeof queryTokenFromRouter === 'string' && queryTokenFromRouter.trim() !== ''
        ? queryTokenFromRouter.trim()
        : null) ?? parseInvitationToken(teamLink);
    if (!invitationToken) {
      toast.error('팀 링크를 확인해 주세요.');
      return;
    }

    mutate({
      body: {
        userEmail: user.email,
        token: invitationToken,
      },
    });
  };

  return (
    <>
      <Head>
        <title>팀 참여하기 | Coworkers</title>
        <meta name="description" content="공유받은 팀 링크로 팀에 참여합니다." />
      </Head>

      <div className="bg-background-secondary flex min-h-full flex-1 items-center justify-center p-4 md:p-6">
        <section className="border-background-tertiary bg-background-primary w-full max-w-[420px] min-w-0 rounded-2xl border p-6 shadow-sm md:p-8">
          <h1 className="text-txt-primary text-xl font-bold tracking-tight break-words">
            팀 참여하기
          </h1>

          <form
            className="mt-8 flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleJoin();
            }}
            noValidate
          >
            <FormField className="gap-2">
              <FormField.Label className="text-txt-secondary text-sm font-medium">
                팀 링크
              </FormField.Label>
              <FormField.Control>
                <Input
                  type="text"
                  name="teamLink"
                  autoComplete="off"
                  placeholder="팀 링크를 입력해주세요."
                  value={teamLink}
                  onChange={(e) => setTeamLink(e.target.value)}
                  className="placeholder:text-md placeholder:text-txt-default rounded-[10px] placeholder:font-normal"
                />
              </FormField.Control>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitDisabled}
              title={
                !isUserPending && !canJoinWithSession ? '로그인 후 참여할 수 있습니다.' : undefined
              }
              className="h-12 w-full rounded-[10px] text-base font-bold"
            >
              {isPending ? '참여 중...' : isUserPending ? '확인 중...' : '참여하기'}
            </Button>
          </form>

          {!isUserPending && !canJoinWithSession ? (
            <p className="text-txt-secondary mt-4 text-center text-sm break-words">
              <Link
                href={{ pathname: ROUTES.LOGIN, query: { redirect: postLoginRedirectPath() } }}
                className="text-brand-primary font-medium underline underline-offset-2 hover:opacity-90"
              >
                로그인
              </Link>
              후 팀에 참여할 수 있어요.
            </p>
          ) : (
            <p className="text-txt-secondary mt-4 text-center text-sm break-words">
              공유받은 팀 링크를 입력해 참여할 수 있어요.
            </p>
          )}
        </section>
      </div>
    </>
  );
}

AcceptInvitationPage.getLayout = function getLayout(page: ReactElement) {
  return <GlobalLayout>{page}</GlobalLayout>;
};
