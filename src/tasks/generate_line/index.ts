import { ChatCompletionMessageParam } from "openai/resources";
import { Tables } from "../../utils/database.helpers";
import { openai } from "../../utils/openai";
import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { Job, SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

import { cotIndustryChallenge } from "./cot_industry_challenge";
import { cotReferral } from "./cot_mock_referral";
import { cotCompliments } from "./cot_compliments_about_company";
import { cotRefinedIndustryChallenge } from "./cot_refined_industry_challenge";
import { cotRefinedReferral } from "./cot_refined_mock_referral";
import { cotRefinedCompliments } from "./cot_refined_compliments_about_company";

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
    let industry = form.industry;

    /* Get Industry */
    if (!industry || industry === "") {
      const sysPrompt0 = `
      You will be provided with an company bio. Your task is to tell me the industry of the company. Use 2-5 words.\n`;
      const prompt0 = `
      Company Bio: Guardian Boost is a professional gaming service that specializes in helping players achieve their goals in the popular video game Destiny 2. They offer a wide range of boosting services, including guaranteed exotic item acquisition, completion of difficult raid challenges, and flawless runs in the competitive Trials of Osiris game mode. With a team of experienced boosters, Guardian Boost strives to provide fast and efficient service, starting most orders within an hour of purchase. They also prioritize customer satisfaction, offering a 7-day money-back guarantee and aiming to complete orders within 16-24 hours. Their boosters use VPN protection to ensure the safety and privacy of their clients' accounts. If customers have any questions or need assistance, they can reach out to Guardian Boost's live chat support.\n
      You: game boosting & coaching\n
      Company Bio: Lalo aims to provide a safe and secure space for users to preserve their memories and connect with loved ones, while giving them full control over their privacy and content.\n
      You: private family media\n
      Company Bio: Fulkerson Winery is a family-owned business with a rich history spanning seven generations of family farming. They offer a variety of products and services, including seated tastings, sales, U-Pick crops, and supplies for beer and winemaking. They are known for their fresh, unpasteurized, 100% whole grape juice, which is perfect for home winemaking. Fulkerson Winery has been recognized as the New York Sauvignon Blanc Winery of the Year for 2021, a testament to their commitment to quality and excellence. Customers can sign up for their newsletter to stay updated on the latest news and events from the winery.\n
      You: Online Wine and Spirits\n
      Company Bio: Forrest seems to be a promising tool for businesses seeking automated social media content to boost their online presence and engagement.\n
      You: social media automation software
      Company Bio: Based on the scraped website, the company is called AnimoX Animo and they specialize in helping businesses grow their brand through various marketing strategies. They pride themselves on being the tools for their clients, who are the artists, and emphasize the importance of content in storytelling. Their services include graphic design, video marketing, social media marketing, branding and design, and web design development. They also offer a free consultation and audit of clients' marketing efforts to ensure they are effective and not wasting money. The website showcases testimonials from satisfied clients and highlights their successful projects, such as running ads for DSR and growing the YouTube personality Javi Enrique. Overall, AnimoX Animo presents itself as a reliable and innovative marketing agency that can help businesses achieve success.\n
      You: graphic design service
      Company Bio: ${content}\n
      You:\n
      `;
      const m0: ChatCompletionMessageParam[] = [
        {
          "role": "system",
          "content": sysPrompt0,
        },
        {
          "role": "user",
          "content": prompt0,
        },
      ];
      const chat0 = await openai.chat.completions.create({
        messages: m0,
        model: "gpt-3.5-turbo",
        stream: false,
        temperature: 0,
        max_tokens: 64,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      industry = chat0.choices[0].message.content ??
        "Service industry";
    }

    /* system prompt */
    const sysPrompt1 = `
    You will be provided with an industry, a focus and a company bio. 
    Your task is to generate an engaging first line of an email using a 9th grader English level. Write in past tense.`;

    // Sending the cleaned version to OPEN-AI
    const prompt1 = `
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
      case "Mock referral":
        cot = cotReferral;
        break;
      default:
        cot = cotIndustryChallenge;
        break;
    }

    // --------------------------------------
    const m1: ChatCompletionMessageParam[] = [
      {
        "role": "system",
        "content": sysPrompt1,
      },
      ...cot,
      { role: "user", content: prompt1 },
    ];
    const chat1 = await openai.chat.completions.create({
      messages: m1,
      model: "gpt-3.5-turbo",
      stream: false,
      temperature: 0,
      max_tokens: 64,
      top_p: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const gen1 = chat1.choices[0].message.content;
    const meta1 = {
      model: chat1.model,
      prompt_tokens: chat1.usage?.prompt_tokens,
      completion_tokens: chat1.usage?.completion_tokens,
      total_tokens: chat1.usage?.total_tokens,
    };

    // --------------------------------------
    //     \n6. Use past tense
    //     \n2. Use a 9th grader English level
    // Sentence must not start with "I've been<<<
    const sysPrompt2 = `
    Improve a provided sentence by applying strictly following rules:
    \n1. Keep the content concise and relevant
    \n2. Ensure the output is not generic
    \n3. Remove fillers
    \n4. Write from the first person but be creative
    \n5. Write only 1 sentence and only 15-20 words
    \n6. Keep the context and the company connection.`;

    /* Refine cot */
    let cotRefined;
    switch (focus) {
      case "Trends and challenges of industry":
        cotRefined = cotRefinedIndustryChallenge;
        break;
      case "Compliments about company":
        cotRefined = cotRefinedCompliments;
        break;
      case "Mock referral":
        cotRefined = cotRefinedReferral;
        break;
      default:
        cotRefined = cotRefinedIndustryChallenge;
        break;
    }

    const m2: ChatCompletionMessageParam[] = [
      { role: "system", content: sysPrompt2 },
      ...cotRefined,
      { role: "user", content: gen1 },
    ];

    // --------------------------------------
    const chat2 = await openai.chat.completions.create({
      messages: m2,
      model: "gpt-3.5-turbo",
      stream: false,
      temperature: 0,
      max_tokens: 64,
      top_p: 0.01,
      frequency_penalty: 0,
      presence_penalty: -1,
    });
    const generated_line = chat2.choices[0].message.content;
    const meta2 = {
      model: chat2.model,
      prompt_tokens: chat2.usage?.prompt_tokens,
      completion_tokens: chat2.usage?.completion_tokens,
      total_tokens: chat2.usage?.total_tokens,
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
