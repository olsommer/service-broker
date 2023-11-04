import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";
import { pickSentenceBeginning } from "./pick_sentence_beginning";

export async function gptGetRefinedWithCoT(
  line: string,
  industry: string,
  content: string,
  focus: string,
) {
  const settings = {
    model: "gpt-3.5-turbo",
    stream: false,
    temperature: 0.2,
    top_p: 0, // 0.05
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const system = `
    Your name is Alice. You are a communications sepcialist.\n
    Optimize the provided sentence step by step without losing context, relevance and reference to the company.\n
    Please make also sure that the output is not generic.\n
    \n\n
    Here is some context for you:\n
    I need to write a cold email to a potential client.
    The line I will provide you with is the first line of the email.
    The goal of this first line is to get the attention of the potential client and to make them want to read the rest of the email.
    Therefore it is important that the line is engaging and relevant to the potential client. 
    The industry of the potential client is "${industry}" the company bio is "${content}".\n;
    `;

  const cot1 = `
    Alice, here is your first task but do not break the previous rules:
    \n- Rewrite the sentence so does not start "I really like..." (make sure you keep the context, relevance and reference to the company).
    \n- Make sure that my potential client is addressed in the second person (you, your).      
    \n\n
    Sentence: ${line}\n
    Alice:
    `;

  const cot2 = `
    Alice, that was really good! Here is next task but do not break the previous rules:
    \n- Rewrite so that the sentence has only 12-17 words and remove fillers.
    \n\n
    Sentence: ${line}\n
    Alice:
    `;

  /*
      Sentence: I really like that they have reasonable prices compared to other game boosting competitors.\n
    Alice: When I was searching for destiny boosting services, I was impressed that you had such low costs compared to competitors.\n
    Sentence: I really like that Fulkerson Winery has a rich tradition of seven generations in wine production.\n
    Alice: I'm truly impressed by Fulkerson Winery's rich tradition of seven generations in the wine production industry.\n
    Sentence: ${line}\n
  */

  /*
    Sentence: I really like that they have a great and super voice recording feature for when I want to record my relatives stories.\n
    Alice: ${
    pickSentenceBeginning(focus)
  } your voice recording feature, which allows me to capture the stories of my relatives.\n
    Sentence: ${line}\n
  */

  const m1: ChatCompletionMessageParam[] = [
    { role: "system", content: system },
    { role: "user", content: cot1 },
  ];

  const chat1 = await openai.chat.completions.create({
    messages: m1,
    ...settings,
    stream: false,
  });

  const line1 = chat1.choices[0].message.content;
  const meta1 = {
    model: chat1.model,
    prompt_tokens: chat1.usage?.prompt_tokens,
    completion_tokens: chat1.usage?.completion_tokens,
    total_tokens: chat1.usage?.total_tokens,
  };

  const m2: ChatCompletionMessageParam[] = [
    { role: "system", content: system },
    { role: "user", content: cot1 },
    { role: "assistant", content: line1 },
    { role: "user", content: cot2 },
  ];

  const chat2 = await openai.chat.completions.create({
    messages: m2,
    ...settings,
    stream: false,
  });

  const line2 = chat2.choices[0].message.content;
  const meta2 = {
    model: chat2.model,
    prompt_tokens: chat2.usage?.prompt_tokens,
    completion_tokens: chat2.usage?.completion_tokens,
    total_tokens: chat2.usage?.total_tokens,
  };

  return {
    data: line2,
    meta: [meta1, meta2],
  };
}
