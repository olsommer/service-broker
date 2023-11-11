import { supa } from "../../utils/supabase";
import { setTimeout } from "timers/promises";

export async function release(leads_job_id: string) {
  const { error } = await supa
    .from("leads_jobs")
    .update({ is_blocked: null })
    .eq("id", leads_job_id);
  if (error) throw error;
}
