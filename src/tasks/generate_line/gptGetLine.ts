import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";
import { cotIndustryChallenge } from "./cot_industry_challenge";
import { cotCompliments } from "./cot_compliments_about_company";
import { cotLookingForService } from "./cot_looking_for_their_service_mock";

export async function gptGetLine(
  content: string,
  industry: string,
  focus: string,
) {
  /* system prompt */
  const sysPrompt = `
 You will be provided with an industry, a focus and a company bio. 
 Your task is to generate an engaging first line of an email using a 9th grader English level. Write in past tense.`;

  // Sending the cleaned version to OPEN-AI
  const prompt = `
 Industry: ${industry}\n
 Focus: ${focus}\n
 Company Bio: ${content}`;

  /* select cot */
  let cot;
  switch (focus) {
    case "Trends and challenges of industry":
      cot = cotIndustryChallenge;
      break;
    case "Compliments about company":
      cot = cotCompliments;
      break;
    case "Looking for their service mock":
      cot = cotLookingForService;
      break;
    default:
      cot = cotCompliments;
      break;
  }

  // --------------------------------------
  const messages: ChatCompletionMessageParam[] = [
    {
      "role": "system",
      "content": sysPrompt,
    },
    ...cot,
    { role: "user", content: prompt },
  ];
  const chat = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    stream: false,
    temperature: 0.9,
    max_tokens: 64,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: -0.5,
  });

  const gen = chat.choices[0].message.content;

  const meta = {
    model: chat.model,
    prompt_tokens: chat.usage?.prompt_tokens,
    completion_tokens: chat.usage?.completion_tokens,
    total_tokens: chat.usage?.total_tokens,
  };

  return {
    data: gen,
    meta: meta,
  };
}
