import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";
import { sentenceBeginning } from "./sentenceBeginning";
import { fewShots } from "./fewshots_refined";

export async function gptGetRefinedLine(
  line: string,
  industry: string,
  content: string,
  focus: Focus,
  company_name: string | undefined,
) {
  const settings = {
    model: "gpt-3.5-turbo-1106",
    stream: false,
    temperature: 0.2,
    top_p: 0, // 0.05
    frequency_penalty: 0,
    presence_penalty: -0.5,
  };

  const beginnings = sentenceBeginning[focus];
  const beginning = beginnings[crypto.getRandomValues(new Uint32Array(1))[0] % beginnings.length];  
  
  const system = `
    Your name is Alice. You are a communications sepcialist.\n
    Optimize the provided sentence without losing context, relevance and reference to the company.\n
    Please make also sure that the output is not generic.\n
    \n\n
    Here is some context for you:\n
    I need to write a cold email to a potential client.
    The line I will provide you with is the first line of the email.
    The goal of this first line is to get the attention of the potential client and to make them want to read the rest of the email.
    Therefore it is important that the line is engaging and relevant to the potential client. 
    The industry of the potential client is "${industry}" the company bio is "${content}" and the company name is "${company_name}".\n;
    `;

  const cot1 = `
    Alice, here is your first task - do not break the previous rules:
    \n- The sentence shall start with ${beginning} (make sure you keep the context, relevance and reference to the company).
    \n- Make sure that my potential customer is addressed in the second person and with the company name.
    \n- You are not allowed to generalize the subject of the message (example of what not to use "this company, their service, this website")
    \n- Rewrite so that the sentence has only 15-20 words 
    \n- Remove fillers   
    \n\n
    \nSentence: ${fewShots[focus][beginning][1]["bad"]}
    \nAlice: ${fewShots[focus][beginning][1]["good"]}
    \nSentence: ${fewShots[focus][beginning][2]["bad"]}
    \nAlice: ${fewShots[focus][beginning][2]["good"]}
    \nSentence: ${line}
    \nAlice:
    `;

  // const cot2 = `
  //   Alice, that was really good! Here is next task but do not break the previous rules:
  //   \n- Rewrite so that the sentence has only 12-17 words and remove fillers.
  //   \n\n

  //   Sentence: ${line}\n
  //   Alice:
  //   `;

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

  const chat = await openai.chat.completions.create({
    messages: m1,
    ...settings,
    stream: false,
  });


  const meta = {
    model: chat.model,
    prompt_tokens: chat.usage?.prompt_tokens,
    completion_tokens: chat.usage?.completion_tokens,
    total_tokens: chat.usage?.total_tokens,
  };

  // const m2: ChatCompletionMessageParam[] = [
  //   { role: "system", content: system },
  //   { role: "user", content: cot1 },
  //   { role: "assistant", content: line1 },
  //   { role: "user", content: cot2 },
  // ];

  // const chat2 = await openai.chat.completions.create({
  //   messages: m2,
  //   ...settings,
  //   stream: false,
  // });

  // const line2 = chat2.choices[0].message.content;
  // const meta2 = {
  //   model: chat2.model,
  //   prompt_tokens: chat2.usage?.prompt_tokens,
  //   completion_tokens: chat2.usage?.completion_tokens,
  //   total_tokens: chat2.usage?.total_tokens,
  // };

  return {
    data: chat.choices[0].message.content,
    meta,
  };
}
