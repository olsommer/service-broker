import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";
import { cotIndustryChallenge } from "./cot_industry_challenge";
import { cotCompliments } from "./cot_compliments_about_company";
import { cotLookingForService } from "./cot_looking_for_their_service_mock";

export async function gptGetCompliment(
  content: string,
  industry: string,
  focus: string,
) {
  /* system prompt */
  const sysPrompt = `
  Your name is Alice. You are a communications specialist. 
  Draft an engaging first line of an email to a potential client.
  Strict rules: Use a 9th grader English level and past tense. 
  You will be provided with an industry and a company bio.`;

  const instruction = `
    Draft an engaging first line of an email to a potential client.
    Strict rules: Use a 9th grader English level and past tense. 
    You will be provided with an industry and a company bio.
    If you understand, write "OK".`;

  const prompt = `
    Industry: Game boosting & coaching\n
    Focus: Compliments about company\n
    Company Bio: Guardian Boost is a company that helps players in a game called Destiny 2. They offer services like getting rare items, completing difficult missions, and winning in competitive modes. They have a team of skilled players who can help other players achieve their goals in the game. Guardian Boost guarantees customer satisfaction and they start working on orders quickly. They also have a money-back guarantee and use VPN protection to keep everything safe. They offer different types of services and have received positive reviews from customers. Overall, Guardian Boost is a reliable and helpful service for players who need assistance in the game.
    Alice: I really like that Guardian Boost has reasonable prices compared to other game boosting competitors.
    Industry: Private family media\n
    Focus: Compliments about company\n
    Company Bio: Remento is a company that helps people preserve their parent's memories in a special book. They have a technology called Speech-To-Story™ that turns recordings of their parents talking into written stories. The book includes prompts and questions to help guide the recording process. Families can share the recordings with each other and leave comments. Remento also has a private and secure memory hub where all the content can be accessed and downloaded. The company believes that family history should be fun and offers a $10 discount for the first purchase.
    Alice: I really like that Remento has a voice recording feature for when I want to record my relatives stories.
    Industry: Online Wine and Spirits\n
    Focus: Compliments about company\n
    Company Bio: Fulkerson Winery is a family-owned business that has been farming for seven generations. They offer tours and tastings where you can try different types of wine. They have won awards for their Sauvignon Blanc wine. They also sell grape juice for people who want to make their own wine at home. They are taking safety precautions to keep everyone safe during the pandemic. You can sign up for their newsletter to get updates and news from the winery.
    Alice: I really like that Fulkerson Winery has a rich tradition of seven generations in wine production.\n
    Industry: ${industry}\n
    Focus: ${focus}\n
    Company Bio: ${content}\n
    Alice:
    `;

  // --------------------------------------
  const messages: ChatCompletionMessageParam[] = [
    {
      "role": "system",
      "content": sysPrompt,
    },
    {
      "role": "user",
      "content": instruction,
    },
    {
      "role": "assistant",
      "content": "OK",
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
    temperature: 0.2,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
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
