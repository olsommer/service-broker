import { supa } from "../../utils/supabase";
import { log } from "../log";
import { setNextState } from "../next";
import { SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

import { gptGetIndustry } from "./gptGetIndustry";
import { gptGetLine } from "./gptGetLine";
import { gptGetLineRefined } from "./gptGetLineRefined";
import { gptGetChallenge } from "./gptGetChallenge";

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
      focus: string;
      industry: string;
      companyUSP: string;
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

    /* industry */
    let industry = form.industry;
    let industryMeta = {};

    /* Get Company USP */
    let companyUSP = form.companyUSP;
    console.log(companyUSP);

    /* Get Industry */
    if (!industry || industry === "") {
      const { data: indData, meta: indMeta } = await gptGetIndustry(content);
      industry = indData;
      industryMeta = indMeta;
    }

    let preLine;
    let preLineMeta;

    switch (focus) {
      case "Trends and challenges of industry":
        const { data: industryData, meta: indMeta } = await gptGetIndustry(
          content,
        );
        const { data: challengeData, meta: challengeMeta } =
          await gptGetChallenge(
            companyUSP,
            industryData,
          );
        industry = industryData;
        industryMeta = indMeta;
        preLine = challengeData;
        preLineMeta = challengeMeta;

        break;
      case "Compliments about company" || "Looking for their service mock":
        if (!industry || industry === "") {
          const { data: industryData, meta: indMeta } = await gptGetIndustry(
            content,
          );
          industry = industryData;
          industryMeta = indMeta;
        }

        const { data: lineData, meta: lineMeta } = await gptGetLine(
          content,
          industry,
          focus,
        );
        preLine = lineData;
        preLineMeta = lineMeta;
        break;
      default:
        throw new Error("No focus");
    }

    if (!preLine) throw new Error("Nothing was generated");

    const { data: finalLine, meta: finalLineMeta } = await gptGetLineRefined(
      preLine,
      focus,
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
    await setNextState(id, "FLAG_TO_FINISH");
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "generate");
  }
}
