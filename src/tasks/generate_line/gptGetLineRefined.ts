// import { ChatCompletionMessageParam } from "openai/resources";
// import { openai } from "../../utils/openai";
// import { cotRefinedIndustryChallenge } from "./cot_refined_industry_challenge";
// import { cotRefinedCompliments } from "./cot_refined_compliments_about_company";
// import { cotRefinedLookingForService } from "./cot_refined_looking_for_their_service_mock";

// export async function gptGetLineRefined(
//   line: string,
//   focus: string,
// ) {
//   // --------------------------------------
//   // \n6. Use past tense
//   // \n2. Use a 9th grader English level
//   // Sentence must not start with "I've been<<<
//   // \n-> Keep the content concise and relevant
//   const sysPrompt2 = `
//     Paraphrase the provided sentence by applying STRICTLY following rules:
//     \n-> Rewrite the sentence so that it begins with "${
//     pickSentenceBeginning(focus)
//   }"
//     \n-> Rewrite the sentence without losing context, relevance and reference to the company.
//     \n-> Make sure the output is not generic
//     \n-> Remove fillers
//     \n-> Write from the first person
//     \n-> Write only 1 sentence and only 10-15 words
//     `;

//   /* Refine cot */
//   let cotRefined;
//   switch (focus) {
//     case "Trends and challenges of industry":
//       cotRefined = cotRefinedIndustryChallenge;
//       break;
//     case "Compliments about company":
//       cotRefined = cotRefinedCompliments;
//       break;
//     case "Looking for their service mock":
//       cotRefined = cotRefinedLookingForService;
//       break;
//     default:
//       cotRefined = cotRefinedIndustryChallenge;
//       break;
//   }
//   // --------------------------------------
//   const messages: ChatCompletionMessageParam[] = [
//     { role: "system", content: sysPrompt2 },
//     ...cotRefined,
//     { role: "user", content: line },
//   ];

//   const chat = await openai.chat.completions.create({
//     messages,
//     model: "gpt-3.5-turbo",
//     stream: false,
//     temperature: 1, // 0
//     max_tokens: 64,
//     top_p: 0, // 0.05
//     frequency_penalty: 0,
//     presence_penalty: -0.5,
//   });
//   const refined = chat.choices[0].message.content;
//   const meta = {
//     model: chat.model,
//     prompt_tokens: chat.usage?.prompt_tokens,
//     completion_tokens: chat.usage?.completion_tokens,
//     total_tokens: chat.usage?.total_tokens,
//   };

//   return {
//     data: refined,
//     meta: meta,
//   };
// }
