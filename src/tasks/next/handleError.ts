import { supa } from "../../utils/supabase";
import { log } from "../log";
import { Tables } from "../../utils/database.helpers";
import { Job } from "bullmq";
import { Payload } from "../../worker";
import { finishQ, finishQueue } from "../../utils/bullmq";

export async function handleError(
  job: Job<Payload, any, string>,
  error: unknown,
  current_status: Tables<"leads_jobs">["status"],
  tries?: number,
) {
  /* Log error */
  console.error(error);

  /* Log error */
  await log("ERROR", (error as Error).message, job.data.new.id, "generate");

  /* Update status */
  const { error: supaError } = await supa
    .from("leads_jobs")
    .update({
      status: "ERROR_TIMEOUT",
      status_before: current_status,
      tries,
      // job_collected: status == "DONE" ? true : false,
      job_collected: true,
    })
    .eq("id", job.data.new.id);
  if (supaError) throw supaError;

  /* Add to finish queue */
  const newJobData = {
    ...job.data,
    new: {
      ...job.data.new,
      status: "ERROR_TIMEOUT",
    },
  };
  finishQueue.add(finishQ, newJobData, {
    removeOnComplete: true,
    removeOnFail: true,
  });
}
