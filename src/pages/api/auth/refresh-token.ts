import { isApiError } from '@/shared/api/mapApiError';
import { ACCESS_TOKEN_MAX_AGE, COOKIE_OPTIONS } from '@/shared/constants/auth';
import backendFetcher from '@/shared/lib/axios/backend-fetcher';
import { ApiError } from '@/shared/types/apiError';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '올바르지 않은 접근입니다' });
  }

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token이 없습니다' });
  }

  try {
    const { data } = await backendFetcher.post('/auth/refresh-token', { refreshToken });

    res.setHeader(
      'Set-Cookie',
      serialize('accessToken', data.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      }),
    );

    return res.status(200).json({ success: true, accessToken: data.accessToken });
  } catch (error: unknown) {
    if (isApiError(error)) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || '요청 처리 중 서버 오류가 발생했습니다.' });
    }
  }
}
