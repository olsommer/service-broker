import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";

// const sysPrompt =
// `You are a helpful assistant. You will receive a full company name. Your task is to give me a cleaned-up version of the company name without the legal form.
// If you cannot find a legal form, strip and output the full company name. Output only the company name, nothing more! \n`;
// const prompt = `
// Full company name: GuardianBoost LLC\n
// Cleaned version: GuardianBoost\n
// Full company name: Snap Inc.\n
// Cleaned version: Snap\n
// Full company name: Acme\n
// Cleaned version: Acme\n
// Full company name: ${companyNameRaw}\n
// Cleaned version:
// `;

export async function gptGetCompanyName(companyNameRaw: string) {
  const sysPrompt =
    `Instruction: Clean-up this company name without the legal form. 
  If you cannot find a legal form, strip and output the full company name. Output only the company name, nothing more! \n`;
  const prompt = `
    Instruction: Provide me a cleand version of a company name without the legal form. If you cannot find a legal form, strip and output the full company name. Output only the company name, nothing more! \n\n
    Full company name: GuardianBoost LLC\n
    Cleaned version: GuardianBoost\n
    Full company name: Snap Inc.\n
    Cleaned version: Snap\n
    Full company name: Acme\n
    Cleaned version: Acme\n
    Full company name: ${companyNameRaw}\n
    Cleaned version:`;
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
  const chat = await openai.completions.create({
    // messages,
    prompt: prompt,
    model: "gpt-3.5-turbo-instruct",
    stream: false,
    temperature: 0,
    max_tokens: 64,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: -1.5,
  });

  const meta = {
    model: chat.model,
    prompt_tokens: chat.usage?.prompt_tokens,
    completion_tokens: chat.usage?.completion_tokens,
    total_tokens: chat.usage?.total_tokens,
  };

  return {
    // data: chat.choices[0].message.content!,
    data: chat.choices[0].text,
    meta: meta,
  };
}
