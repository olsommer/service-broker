import { supa } from "../../utils/supabase";
import { log } from "../log";
import { Tables } from "../../utils/database.helpers";

export async function setNextState(
  id: string,
  status: Tables<"leads_jobs">["status"],
  status_before: Tables<"leads_jobs">["status_before"],
  tries?: number,
) {
  const { error } = await supa
    .from("leads_jobs")
    .update({
      status,
      status_before: status_before,
      tries,
      // job_collected: status == "DONE" ? true : false,
      job_collected: true,
    })
    .eq("id", id);
  if (error) throw error;
}
