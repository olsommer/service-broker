import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";
import { cotIndustryChallenge } from "./cot_industry_challenge_2";

export async function gptGetChallenge(
  companyUSP: string,
  industry: string,
) {
  const sysPrompt = `
  Your name is Alice, my name is Alex and my customer is Bob. 
  Bob will tell you his industry and I will tell you what my business does. 
  Your task is to give me one specific challenge that Bob's company faces which my business solves.\n;`;
  const prompt = `
  Alex gives Alice feedback for the previously generated line: This was again very good!\n
  Alex tells Alice what his business does: I help customers ${companyUSP}.\n
  Bob tells Alice his industry: ${industry}.\n
  Alice:\n`;

  const messages: ChatCompletionMessageParam[] = [
    {
      "role": "system",
      "content": sysPrompt,
    },
    ...cotIndustryChallenge,
    {
      "role": "user",
      "content": prompt,
    },
  ];
  const chat = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    stream: false,
    temperature: 0.9,
    max_tokens: 256,
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
    data: chat.choices[0].message.content,
    meta: meta,
  };
}
