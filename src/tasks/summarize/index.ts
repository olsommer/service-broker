import { log } from "../log";
import { supa } from "../../utils/supabase";
import { openai } from "../../utils/openai";
import { Tables } from "../../utils/database.helpers";
import { setNextState } from "../next";
import { Job, SandboxedJob } from "bullmq";
import { Payload } from "../../worker";
import { ChatCompletionMessageParam } from "openai/resources";
import { generateQueue, retryQueue, summarizeQueue } from "../../utils/bullmq";
import { delivered } from "../../producer";
import { release } from "./release";

export async function summarize(job: Job<Payload, any>) {
  const { new: record } = job.data;
  const { id, job_id, lead_id } = record;
  try {
    if (!job_id) throw new Error("No job id");
    if (!lead_id) throw new Error("No lead_id provided");
    // Get form data
    // --------------------------------------
    const { data: leadsData, error: leadsErr } = await supa
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .limit(1)
      .single();
    if (leadsErr) throw leadsErr;

    const content_cleaned = leadsData.website_content_cleaned;
    // Get job data
    // --------------------------------------
    // const { data: jobsData, error: jobsErr } = await supa
    //   .from("jobs")
    //   .select("*")
    //   .eq("id", job_id)
    //   .limit(1)
    //   .single();
    // if (jobsErr) throw jobsErr;
    // const form = jobsData.meta as { focus: string; industry: string };

    // Clean HTML
    // --------------------------------------
    // const content_cleaned = convertToPlain(content);

    // Prompt Focus
    // --------------------------------------
    // const focus = form.focus ? form.focus : "compliments about the company";

    const systemPrompt =
      `Summarize a scraped website you are provided with for a second-grade student in 1 paragraph.`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: content_cleaned,
      },
    ];
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo-1106",
      stream: false,
      temperature: 0,
      max_tokens: 1024,
    });
    const summary = chatCompletion.choices[0].message.content;
    const meta = {
      model: chatCompletion.model,
      prompt_tokens: chatCompletion.usage?.prompt_tokens,
      completion_tokens: chatCompletion.usage?.completion_tokens,
      total_tokens: chatCompletion.usage?.total_tokens,
    };

    /* Save scrapes to db */
    const { error: leadsError } = await supa
      .from("leads")
      .update({
        website_summary: summary,
      })
      .eq("id", lead_id);
    if (leadsError) throw leadsError;

    /* Save costs */
    const { error: metaError } = await supa
      .from("costs")
      .insert(
        {
          lead_id,
          meta,
          job: "SUMMARIZE",
        },
      );
    if (metaError) {
      await log(
        "ERROR",
        metaError.message,
        id,
        "continue but could not save meta",
      );
    }

    /* Set next job */
    generateQueue.add("generateJob", job.data, {
      removeOnComplete: true,
      removeOnFail: true,
    }).then(delivered);

    /* Release lock */
    release(id);

    /* Set next state */
    await setNextState(id, "FLAG_TO_GENERATE", "FLAG_TO_SUMMARIZE");
  } catch (error) {
    console.log(error);
    await log("ERROR", (error as Error).message, id, "summarize");
    await setNextState(id, "ERROR_TIMEOUT", "FLAG_TO_SUMMARIZE", 1);
  }
}
