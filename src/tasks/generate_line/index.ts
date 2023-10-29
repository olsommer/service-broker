import { ChatCompletionMessageParam } from "openai/resources";
import { Tables } from "../../utils/database.helpers";
import { openai } from "../../utils/openai";
import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { Job, SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

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

    /* focus */
    const focus = form.focus ??
      "Compliments about the company";

    /* industry */
    const industryPrompt = form.industry ? form.industry : "";

    // Sending the cleaned version to OPEN-AI
    // Prompts
    // Neither generate questions nor exclamation marks.
    // Make it as personal as possible by using the summary of the scraped homepage.
    const prompt =
      `I want you to craft you an engaging first line of an email using the below provided information. Keep the wording and tone casual. Avoid generic AI-content, make the content original and unique. Avoid repetitions. Only use the examples as reference points.  The brackets are only for your information, dont provide them in the final output. 
    \n\n
    Industry: ${industryPrompt}\n
    Focus/Challenge: ${focus}\n
    Company Bio: ${content}\n
    \n\n
    Format:
    {Syntax}+ [[Industry]]+((Focus/Challenge))
    Syntax= Parts of the sentence that should have variable but similar wording. Keep changing the syntax in the output
    Industry= Provided above
    Focus/Challenge= Provided above
    \n\n
    Examples:  
    I've been delving into the world of [[Edtech]], and it's apparent that tackling the {user adoption} puzzle is an ongoing challenge for many in the industry.\n
    {I've been tracking the} [[cold outreach industry]] {closely, and it's evident that companies are struggling with} ((generating effective icebreakers)).\n
    {I've been monitoring} [[graphic design service industry]], {and it's clear to me that many are struggling with} ((increasing their design margins)).\n 
    {I've noticed that} ((posting on social media and social media management)) {is a constant challenge for} [[small businesses]].\n 
    {I've been part of the} [[game boosting industry]] {for a while now and have noticed that} ((hiring pro gamers)) {has always been a challenge when expanding a boosting business to other games}.\n
    {I have been doing a lot of research in the} [[eldercare marketspace]] {and noticed that there is currently a big issue with} ((recording people's stories)) {easily}.\n 
    {I've been exploring the} [[Ecommerce]] {world lately, and it's clear that} ((age verification)) {is posing a significant challenge for many} [[Online Wine and Spirits Stores]].\n
    `;

    // --------------------------------------
    const m1: ChatCompletionMessageParam[] = [{
      role: "system",
      content: "You are a helpful assistant",
    }, { role: "user", content: prompt }];
    const chatCompletion = await openai.chat.completions.create({
      messages: m1,
      model: "gpt-3.5-turbo",
      stream: false,
    });
    const gen1 = chatCompletion.choices[0].message.content;
    const meta1 = {
      model: chatCompletion.model,
      prompt_tokens: chatCompletion.usage?.prompt_tokens,
      completion_tokens: chatCompletion.usage?.completion_tokens,
      total_tokens: chatCompletion.usage?.total_tokens,
    };
    // --------------------------------------

    /* Follow up */

    const followUpPrompt =
      `Please refine the output according to the below instructions:
      1. The output is too wordy. Keep the content concise and relevant
      2. Use a 9th grader English level
      3. Ensure the output is not generic
      4. Remove all fillers from the output
      5. The syntax and sentence should not start with "I've been". Make it unique
      6. The output should be in the past tense      
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: prompt },
      { role: "assistant", content: gen1 },
      { role: "user", content: followUpPrompt },
    ];
    // --------------------------------------
    const chat2 = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      stream: false,
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
