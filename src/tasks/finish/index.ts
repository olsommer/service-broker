import { log } from "../log";
import { supa } from "../../utils/supabase";
import { setNextState } from "../next";
import { billing } from "../billing";
import { Job } from "bullmq";
import { Payload } from "../../worker";
import { rebalanceCredits } from "../billing/rebalanceCredits";
import { waitUntilFree } from "./waitUntilFree";

export async function finish(job: Job<Payload, any>) {
  const { new: record } = job.data;
  const { id, lead_id, job_id, status } = record;
  try {
    if (!lead_id) throw new Error("No lead provided");
    if (!job_id) throw new Error("No job provided");

    /* **WORKAROUND** Check status if is ERROR_TIMEOUT **WORKAROUND** */

    /* Check if job data is available */
    await waitUntilFree(job_id);

    /* Get job data */
    const { data: jobData, error: jobErr } = await supa
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .limit(1)
      .single();
    if (jobErr) throw jobErr;
    if (!jobData.expected_lines) throw new Error("No expected lines provided");
    if (!jobData.user_id) throw new Error("Could not find user");

    // Update gen lines + 1

    const count_errors = jobData.count_errors +
      (status === "ERROR_TIMEOUT" ? 1 : 0);
    const count_gen_lines = jobData.count_gen_lines +
      (status !== "ERROR_TIMEOUT" ? 1 : 0);
    const count_sum = count_errors + count_gen_lines;
    const expected_lines = jobData.expected_lines;

    /* Finish job if last job */
    if (count_sum >= expected_lines) {
      // If Pro job, create billing
      if (jobData.product == "PRO") {
        await billing({
          job_id,
          count_gen_lines,
          expected_lines,
          user_id: jobData.user_id,
          leads_job_id: id,
        });
      }

      // Rebalance credits
      await rebalanceCredits(
        count_gen_lines,
        expected_lines,
        jobData.user_id,
        id,
      );

      /* Update job data */
      const { error: job3Err } = await supa
        .from("jobs")
        .update({
          status: "DONE",
          count_gen_lines,
          count_errors,
          is_blocked: null,
        })
        .eq("id", job_id);
      if (job3Err) throw job3Err;
    } else {
      /* Update job data */
      const { error: job2Err } = await supa
        .from("jobs")
        .update({
          count_gen_lines,
          count_errors,
          is_blocked: null,
        })
        .eq("id", job_id);
      if (job2Err) throw job2Err;
    }

    // Update leads_job data
    await setNextState(id, "DONE", "FLAG_TO_FINISH");
  } catch (error) {
    console.log(error);
    await setNextState(id, "ERROR_TIMEOUT", "FLAG_TO_FINISH", 1);
    await log("ERROR", error as any, id, "finish");
  }
}
