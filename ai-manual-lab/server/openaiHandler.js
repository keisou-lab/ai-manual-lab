import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askOpenAI(question, context) {
  const prompt = `
あなたは取扱説明書の専門AIです。
次の内容をもとに、質問に対してわかりやすく回答してください。
---
【取説内容】
${context.slice(0, 12000)}  // 長すぎるときは切る
---
【質問】
${question}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
