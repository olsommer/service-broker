import { Tables } from "../../utils/database.helpers";
import { openai } from "../../utils/openai";
import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";

export async function generate(record: Tables<"leads_jobs">) {
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
    const content = sumData.content;

    // --------------------------------------
    const focus = form.focus ??
      "Compliments about the company";

    const industryPrompt = form.industry
      ? `The prospects industry is ${form.industry}.`
      : "";

    const templates = () => {
      const _focus = form.focus;
      switch (form.focus) {
        case "Mock referral":
          return `Please use one of the following templates: 
          """{top connection name} referred me to you so I thought I'd reach out.""" \n 
          """I got your contact info from {top connection name}."""`;

        case "Compliments about company":
          return `Please use one of the following templates: 
          """I really like the {service/product} you guys are doing/selling at {company}."""\n 
          """It's really impressive to see all the {products/services} you guys are offering at {company}."""`;

        case "Trends and challenges of industry":
          return `Please use one of the following templates: 
          """I've been tracking the {industry} industry closely, and it's evident that companies are grappling with the challenge of {specific challenge}."""\n 
          """The {industry} sector has always fascinated me, and the current trend of {specific trend} has piqued my interest."""`;

        case "Things in common":
          return `Please use one of the following templates: 
          """I saw that we have {common interest} thing in common."""\n
          """I couldn't help but notice our shared interest in {common interest}."""`;

        case "Looking for their service mock":
          return `Please use one of the following templates: 
          """I was looking for {service/product} and I came across {company}."""
          """Earlier, I was searching for {service/product} and I stumbled across your company, {company}."""`;
      }
    };

    // Sending the cleaned version to OPEN-AI
    // Prompts
    // Neither generate questions nor exclamation marks.
    // Make it as personal as possible by using the summary of the scraped homepage.
    const prompt = `Summary of the scraped homepage: ${content}. 
    \n\n
    Instruction: Above is a summary of the scraped homepage. 
    Write a personalized icebreaker (only the first two lines of a cold email) based on the scraped homepage. ${industryPrompt}
    The goal is to act like a genuine person writing this personalized icebreaker so that there is a higher response from the cold email.
    Write in a authentic, realistic, less flattering, down to earth and casual tone. 
    Write a maximum of two shorter sentences.
    Only output raw trimmed text.
    ${templates()}
    \n\n
    `;

    // --------------------------------------
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      stream: false,
    });
    const generated_line = chatCompletion.choices[0].message.content;
    const meta = {
      model: chatCompletion.model,
      prompt_tokens: chatCompletion.usage?.prompt_tokens,
      completion_tokens: chatCompletion.usage?.completion_tokens,
      total_tokens: chatCompletion.usage?.total_tokens,
    };
    // --------------------------------------

    // Save to the database
    // --------------------------------------
    const { error } = await supa
      .from("lines")
      .insert({
        content: generated_line,
        meta: meta,
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
