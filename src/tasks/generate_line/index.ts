import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

import { gptGetIndustry } from "./gptGetIndustry";
import { gptGetLine } from "./gptGetLine";
import { gptGetChallenge } from "./gptGetChallenge";
import { gptGetCompliment } from "./gptGetCompliment";
import { gptGetRefinedLine } from "./gptGetRefinedLine";
import { gptGetCompanyName } from "./gptGetCompanyName";

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
    const form = jobsData.meta as {
      focus: Focus;
      industry: string;
      companyUSP: string;
    };

    // Get company name 
    // --------------------------------------
    if (!lead_id) throw new Error("No lead provided");
    const { data: leadsData, error: leadsErr } = await supa
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .limit(1)
      .single();
    if (leadsErr) throw leadsErr;
    if (!leadsData) throw new Error("No data");
    const lead = leadsData.lead as {
      company_name: string;
    };

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

    /* Get Company USP */
    let companyUSP = form.companyUSP;

    /* Get Industry */
    const { data: industry, meta: industryMeta } = await gptGetIndustry(
      lead.company_name,
    );

    /* Get Company name */
    const { data: companyName, meta: companyNameMeta } = await gptGetCompanyName(
      content,
    );

    let preLine;
    let preLineMeta;

    switch (focus) {
      case "Trends and challenges of industry":
        const { data: challengeData, meta: challengeMeta } =
          await gptGetChallenge(
            companyUSP,
            industry,
          );
        preLine = challengeData;
        preLineMeta = challengeMeta;
        break;
      case "Compliments about company":
        const { data: lineData, meta: lineMeta } = await gptGetCompliment(
          content,
          industry,
          focus,
        );
        preLine = lineData;
        preLineMeta = lineMeta;
        break;
      case "Looking for their service mock":
        const { data: line2Data, meta: line2Meta } = await gptGetLine(
          content,
          industry,
          focus,
        );
        preLine = line2Data;
        preLineMeta = line2Meta;
        break;
      default:
        const { data: line3Data, meta: line3Meta } = await gptGetLine(
          content,
          industry,
          focus,
        );
        preLine = line3Data;
        preLineMeta = line3Meta;
        break;
    }

    if (!preLine) throw new Error("Nothing was generated");

    const { data: finalLine, meta: finalLineMeta } = await gptGetRefinedLine(
      preLine,
      content,
      industry,
      focus,
      companyName,
    );

    // Save to the database
    // --------------------------------------
    const { error } = await supa
      .from("lines")
      .insert({
        content: finalLine,
        meta: [industryMeta, preLineMeta, finalLineMeta],
        active: true,
        lead_id,
        lead_job_id: id,
      })
      .order("created_at", { ascending: false });
    if (error) throw error;


    /* Save cleand company name to db */
        // Get company name 
    // --------------------------------------
    const { error: companyNameUpdateError } = await supa
    .from("leads")
    .update({
      company_name_cleaned: companyName.toUpperCase(),
    })
    .eq("id", lead_id)
    if (companyNameUpdateError) throw companyNameUpdateError;

    await setNextState(id, "FLAG_TO_FINISH");
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "generate");
  }
}
