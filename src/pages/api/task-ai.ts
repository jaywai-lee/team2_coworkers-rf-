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
    const { userInput, realToday, selectedDate, calendarReference } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `당신은 일정 관리 비서입니다. 사용자의 텍스트를 분석하여 정확히 아래 JSON 형식으로만 응답하세요.

          [시간 기준 가이드]
          1. 실제 현재 시간(Real Today): ${realToday}
          2. 사용자가 보고 있는 달력 날짜(Selected Date): ${selectedDate}
            - 입력에 날짜나 요일 힌트가 '전혀' 없을 때만 이 날짜를 기본 date로 사용하세요.

          [가장 가까운 미래의 요일별 날짜 매핑표 (절대 계산 금지)]
          ${calendarReference}

          [⭐반복 일정 및 요일 판단 규칙 - 매우 중요⭐]
          1. "매일", "매주", "매월" 등의 단어가 있다면 frequencyType을 적절히 설정하세요.
          2. frequencyType이 "WEEKLY"일 경우, weekDays 배열에 요일 숫자를 넣으세요. (0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토)
          3. "매주 월요일"처럼 텍스트에 특정 요일이 포함되어 있다면, selectedDate를 무시하고 반드시 위의 [매핑표]에서 해당 요일의 날짜를 그대로 복사해서 'date'에 넣으세요.
            - (예시) 표에 '[월요일] -> 2026-05-11' 이라고 적혀 있다면, 스스로 계산하지 말고 date 값을 "2026-05-11"로 작성하세요.

          [필수 반환 JSON 스키마]
          {
            "title": "할 일의 핵심 제목",
            "date": "YYYY-MM-DD (알 수 없으면 비워두기)",
            "time": "HH:mm (알 수 없으면 비워두기)",
            "frequencyType": "ONCE | DAILY | WEEKLY | MONTHLY",
            "weekDays": [1] (WEEKLY인 경우에만 요일 숫자 배열, 아니면 생략),
            "monthDay": 15 (MONTHLY인 경우에만 날짜 숫자, 아니면 생략)
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
