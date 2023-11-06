import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";

export async function gptGetCompanyName(companyNameRaw: string) {
  const sysPrompt = `
  You will receive a complete company name. Your task is to give me a cleaned-up version of the company name without the legal form.\n`;
  const prompt = `
    Full company name: GuardianBoost LLC\n
    Cleaned version: GuardianBoost\n
    Full company name: Snap Inc.\n
    Cleaned version: Snap\n
    Full company name: ${companyNameRaw}\n
    Cleaned version:\n
    `;
  const messages: ChatCompletionMessageParam[] = [
    {
      "role": "system",
      "content": sysPrompt,
    },
    {
      "role": "user",
      "content": prompt,
    },
  ];
  const chat = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    stream: false,
    temperature: 0,
    max_tokens: 64,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const meta = {
    model: chat.model,
    prompt_tokens: chat.usage?.prompt_tokens,
    completion_tokens: chat.usage?.completion_tokens,
    total_tokens: chat.usage?.total_tokens,
  };

  return {
    data: chat.choices[0].message.content!,
    meta: meta,
  };
}
