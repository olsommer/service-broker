import { log } from "../log";
import { supa } from "../../utils/supabase";
import { openai } from "../../utils/openai";
import { Tables } from "../../utils/database.helpers";
import { setNextState } from "../next";
import { Job, SandboxedJob } from "bullmq";
import { Payload } from "../../worker";
import { ChatCompletionMessageParam } from "openai/resources";

export async function summarize(job: SandboxedJob<Payload, any>) {
  const { new: record } = job.data;
  const { id, job_id } = record;
  try {
    if (!job_id) throw new Error("No job id");
    // Get form data
    // --------------------------------------
    const { data: scrData, error: scrErr } = await supa
      .from("scrapes")
      .select("*")
      .eq("lead_job_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (scrErr) throw scrErr;
    if (!scrData || !scrData.content_cleaned) throw new Error("No data");
    const content_cleaned = scrData.content_cleaned;

    // Get job data
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

    // Clean HTML
    // --------------------------------------
    // const content_cleaned = convertToPlain(content);

    // Prompt Focus
    // --------------------------------------
    const focus = form.focus ? form.focus : "compliments about the company";

    // Sending the cleaned version to OPEN-AI
    // --------------------------------------
    // const systemPrompt = `Scraped Website: ${content_cleaned}
    //   \n\n
    //   Write a summary of a company based on the aboved scraped website. ${focusPrompt}
    //    This content will later be used to create an icebreaker.
    //    Write at least 5 sentences.
    //    `;
    //
    const systemPrompt =
      `Summarize a scraped website you are provided with for a second-grade student in 3-5 sentences with focus on ${focus}`;

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
      model: "gpt-3.5-turbo",
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

    // Save the summary content to the database
    // --------------------------------------
    const { error } = await supa
      .from("summaries")
      .insert(
        {
          content: summary,
          meta,
          type: "HOMEPAGE",
          lead_job_id: id,
        },
      );
    if (error) throw error;
    await setNextState(id, "FLAG_TO_GENERATE");
  } catch (error) {
    console.log(error);
    await log("ERROR", (error as Error).message, id, "summarize");
  }
}
