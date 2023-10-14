import { log } from "../log";
import { Tables } from "../../utils/database.helpers";
import { supa } from "../../utils/supabase";
import { setNextState } from "../next";
import { billing } from "../billing";

export async function finish(record: Tables<"leads_jobs">) {
  const { id, lead_id, job_id } = record;
  try {
    if (!lead_id) throw new Error("No lead provided");
    if (!job_id) throw new Error("No job provided");

    // Get job data
    // --------------------------------------
    const { data: jobData, error: jobErr } = await supa
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .limit(1)
      .single();
    if (jobErr) throw jobErr;
    if (!jobData) throw new Error("No data");

    if (!jobData.count_file_rows) {
      throw new Error("Could not could rows provided");
    }
    if (!jobData.user_id) throw new Error("Could not find user");

    // Update gen lines + 1
    const count_errors = jobData.count_errors ?? 0;
    const count_file_rows = jobData.count_file_rows;
    const count_gen_lines = (jobData.count_gen_lines ?? 0) + 1;

    // Finish job if last job
    // --------------------------------------
    if ((count_errors + count_gen_lines) === count_file_rows) {
      // Update job data
      // --------------------------------------
      const { error: job3Err } = await supa
        .from("jobs")
        .update({
          status: "DONE",
          count_gen_lines,
        })
        .eq("id", job_id);
      if (job3Err) throw job3Err;

      // If Pro job, create billing
      if (jobData.product == "PRO") {
        await billing({
          job_id,
          count_gen_lines,
          count_file_rows,
          user_id: jobData.user_id,
          leads_job_id: id,
        });
      }
    } else {
      // Update job data
      // --------------------------------------
      const { error: job2Err } = await supa
        .from("jobs")
        .update({
          count_gen_lines,
        })
        .eq("id", job_id);
      if (job2Err) throw job2Err;
    }
    // Set the next state
    // --------------------------------------
    await setNextState(id, "DONE");
  } catch (error) {
    console.log(error);
    await log("ERROR", error as any, id, "finish");
  }
}
