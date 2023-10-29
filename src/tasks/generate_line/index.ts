import { ChatCompletionMessageParam } from "openai/resources";
import { Tables } from "../../utils/database.helpers";
import { openai } from "../../utils/openai";
import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { Job, SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

import { cot } from "./chain_of_thought";

export async function generate(job: SandboxedJob<Payload, any>) {
  const { new: record } = job.data;
  const { id, lead_id, job_id } = record;
  try {
    if (!job_id) throw new Error("No job id");
    // Get form data
    // --------------------------------------
    const { data: jobsData, error: jobsErr } = await supa
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .limit(1)
      .single();
    if (jobsErr) throw jobsErr;
    if (!jobsData) throw new Error("No data");
    const form = jobsData.meta as { focus: string; industry: string };

    // Get summary data
    // --------------------------------------
    const { data: sumData, error: sumErr } = await supa
      .from("summaries")
      .select("*")
      .eq("lead_job_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sumErr) throw sumErr;
    if (!sumData || !sumData.content) throw new Error("No data");

    /* summary */
    const content = sumData.content;
    const focus = form.focus ??
      "Compliments about the company";
    const industryPrompt = form.industry ? form.industry : "";

    /* system prompt */
    const systemPrompt = `
    You will be provided with an industry, a focus/challenge and a company bio. 
    Your task is to generate an engaging first line (after greeting, 
      before call-to-action) of an email using a 9th grader English level. Write in past tense.`;

    // Sending the cleaned version to OPEN-AI
    const prompt1 = `
    Industry: ${industryPrompt}\n
    Focus/Challenge: ${focus}\n
    Company Bio: ${content}\n\n
    AI:`;

    // --------------------------------------
    const m1: ChatCompletionMessageParam[] = [
      {
        "role": "system",
        "content": systemPrompt,
      },
      ...cot,
      { role: "user", content: prompt1 },
    ];
    const chatCompletion = await openai.chat.completions.create({
      messages: m1,
      model: "gpt-3.5-turbo",
      stream: false,
      temperature: 1,
      max_tokens: 64,
      top_p: 0,
      frequency_penalty: 0,
      presence_penalty: 1,
    });

    const gen1 = chatCompletion.choices[0].message.content;
    const meta1 = {
      model: chatCompletion.model,
      prompt_tokens: chatCompletion.usage?.prompt_tokens,
      completion_tokens: chatCompletion.usage?.completion_tokens,
      total_tokens: chatCompletion.usage?.total_tokens,
    };

    // --------------------------------------

    const systemPrompt2 = `
    Improve a engaging first line of an email by applying the following instructions:
    \n1. Keep the content concise and relevant
    \n2. Use a 9th grader English level
    \n3. Ensure the output is not generic
    \n4. Remove all fillers from the output
    \n5. The syntax and sentence must not start with "I've been". Make it unique
    \n6. The output should be in the past tense
    \n7. Write only 1 sentence.`;
    const cot2: ChatCompletionMessageParam[] = [
      {
        "role": "user",
        "content":
          "Line: I've been part of the game boosting industry for a while now and have noticed that hiring pro gamers has always been a challenge when expanding a boosting business to other games.\n\nAI:",
      },
      {
        "role": "assistant",
        "content":
          "Recently, I discovered that hiring professional gamers posed a significant challenge when expanding my boosting business to new games.",
      },
    ];
    /* Follow up */
    const prompt2 = `
    Line:${gen1}\n\n
    AI:
    `;

    const m2: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt2 },
      ...cot2,
      { role: "user", content: prompt2 },
    ];
    console.log(m1);
    console.log(m2);
    // --------------------------------------
    const chat2 = await openai.chat.completions.create({
      messages: m2,
      model: "gpt-3.5-turbo",
      stream: false,
      temperature: 0,
      max_tokens: 64,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 1.5,
    });
    const generated_line = chat2.choices[0].message.content;
    const meta2 = {
      model: chatCompletion.model,
      prompt_tokens: chatCompletion.usage?.prompt_tokens,
      completion_tokens: chatCompletion.usage?.completion_tokens,
      total_tokens: chatCompletion.usage?.total_tokens,
    };

    // --------------------------------------
    await log("OK", chat2.choices as any, id, "generate");

    // Save to the database
    // --------------------------------------
    const { error } = await supa
      .from("lines")
      .insert({
        content: generated_line,
        meta: [meta1, meta2],
        active: true,
        lead_id,
        lead_job_id: id,
      })
      .order("created_at", { ascending: false });
    if (error) throw error;
    await setNextState(id, "FLAG_TO_FINISH");
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "generate");
  }
}
