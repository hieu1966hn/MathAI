export interface GeneratedQuestion {
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export async function generateMathQuestions(
  topicName: string,
  grade: number,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topicName, grade, count })
  });

  if (!response.ok) {
    throw new Error('Không thể sinh câu hỏi tự động. Vui lòng kiểm tra backend proxy Gemini.');
  }

  return response.json();
}
