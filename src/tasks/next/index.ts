import { supa } from "../../utils/supabase";
import { log } from "../log";
import { Tables } from "../../utils/database.helpers";

export async function setNextState(
  id: string,
  status: Tables<"leads_jobs">["status"],
  tries?: number,
) {
  const { error } = await supa
    .from("leads_jobs")
    .update({
      status,
      tries,
      job_collected: false,
    })
    .eq("id", id);
  if (error) throw error;
}
