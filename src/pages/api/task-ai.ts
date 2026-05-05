import Groq from 'groq-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userInput, realToday, selectedDate } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          // ✨ 프롬프트에 명확한 시간 계산 룰을 추가했습니다.
          content: `당신은 일정 관리 비서입니다. 사용자의 텍스트를 분석하여 정확히 아래 JSON 형식으로만 응답하세요. 다른 부가 설명은 절대 하지 마세요.
          
          [시간 기준 가이드 - 매우 중요]
          1. 실제 현재 시간(Real Today): ${realToday}
          - '오늘', '내일', '모레', '다음 주' 같은 상대적인 날짜 표현은 반드시 이 '실제 현재 시간'을 기준으로 계산하세요.
          2. 사용자가 보고 있는 달력 날짜(Selected Date): ${selectedDate}
          - 사용자가 텍스트에 날짜나 요일을 아예 언급하지 않았다면 (예: "오후 3시에 미팅 잡아줘"), 이 '선택한 달력 날짜'를 기본 날짜로 사용하세요.

          [필수 반환 JSON 스키마]
          {
            "title": "할 일의 핵심 제목 (예: 디자이너 미팅)",
            "date": "YYYY-MM-DD (날짜를 알 수 없으면 비워두기)",
            "time": "HH:mm (시간을 알 수 없으면 비워두기)"
          }`,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(aiResponse);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    return res.status(500).json({ error: '일정을 분석하는 데 실패했습니다.' });
  }
}
