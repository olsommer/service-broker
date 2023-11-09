import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { Job } from "bullmq";
import { Payload } from "../../worker";

import { gptGetIndustry } from "./gptGetIndustry";
import { gptGetLine } from "./gptGetLine";
import { gptGetChallenge } from "./gptGetChallenge";
import { gptGetCompliment } from "./gptGetCompliment";
import { gptGetRefinedLine } from "./gptGetRefinedLine";
import { gptGetCompanyName } from "./gptGetCompanyName";

export async function generate(job: Job<Payload, any>) {
  const { new: record } = job.data;
  const { id, lead_id, job_id } = record;
  try {
    if (!job_id) throw new Error("No job id");
    if (!lead_id) throw new Error("No lead_id provided");

    /* Get form data */
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

    /* Get company name */
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

    /* summary */
    const content = leadsData.website_summary;
    if (!content) throw new Error("No website summary provided");

    /* focus */
    const focus = form.focus ??
      "Compliments about the company";

    /* Get Company USP */
    let companyUSP = form.companyUSP;

    /* Get Industry */
    const { data: industry, meta: industryMeta } = await gptGetIndustry(
      content,
    );

    /* Get Company name */
    const { data: companyName, meta: companyNameMeta } =
      await gptGetCompanyName(
        lead.company_name,
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

    /* Get refined line */
    const { data: finalLine, meta: finalLineMeta } = await gptGetRefinedLine(
      preLine,
      content,
      industry,
      focus,
      companyName,
    );

    /* Save industry and company name */
    const { error: leadsError } = await supa
      .from("leads")
      .update({
        company_name_cleaned: companyName,
        industry,
      })
      .eq("id", lead_id);
    if (leadsError) throw leadsError;

    /* Save lines */
    const { error } = await supa
      .from("lines")
      .insert({
        content: finalLine,
        meta: [preLineMeta, finalLineMeta],
        active: true,
        lead_id,
        lead_job_id: id,
      });
    if (error) throw error;

    /* Save cleand company name to db */
    const { error: companyNameUpdateError } = await supa
      .from("leads")
      .update({
        company_name_cleaned: companyName,
      })
      .eq("id", lead_id);
    if (companyNameUpdateError) throw companyNameUpdateError;

    /* Save costs */
    const { error: metaError } = await supa
      .from("costs")
      .insert(
        [{
          lead_id,
          meta: industryMeta,
          job: "INDUSTRY",
        }, {
          lead_id,
          meta: companyNameMeta,
          job: "COMPANY_NAME",
        }, {
          lead_id,
          meta: preLineMeta,
          job: "GENERATE_LINE_FIRST",
        }, {
          lead_id,
          meta: preLineMeta,
          job: "GENERATE_LINE_SECOND",
        }],
      );
    if (metaError) {
      await log(
        "ERROR",
        metaError.message,
        id,
        "continue but could not save meta",
      );
    }

    /* Set next state */
    await setNextState(id, "FLAG_TO_FINISH", "FLAG_TO_GENERATE");

    /* catch error */
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "generate");
  }
}
