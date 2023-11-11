import { supa } from "../../utils/supabase";
import { setTimeout } from "timers/promises";
import { setNextState } from "../next";
import { generateQueue } from "../../utils/bullmq";

export async function lockOrSkip(
  leads_job_id: string,
  lead_id: string,
): Promise<{ skip: boolean; lock: boolean }> {
  /* Get job data */
  const { data, error } = await supa
    .from("leads")
    .select("*")
    .eq("id", lead_id)
    .limit(1)
    .single();
  if (error) throw error;

  if (data.website_summary != null) return { skip: true, lock: false };

  if (data.is_blocked == null) {
    /* FREE DONT SKIP AND DONT LOCK */
    /* Set job data and get it again (double check) */
    const { error: updateErr } = await supa
      .from("leads")
      .update({ is_blocked: leads_job_id })
      .eq("id", lead_id);
    if (updateErr) throw updateErr;

    await setTimeout(Math.random() * (0.8) + 0.2 * 1000); // Wait for 1 seconds max

    /* Get job data */
    const { data: data2, error: error2 } = await supa
      .from("leads")
      .select("is_blocked")
      .eq("id", lead_id)
      .limit(1)
      .single();
    if (error2) throw error2;

    if (data2.is_blocked == leads_job_id) return { skip: false, lock: true };
    return { skip: false, lock: false };
    /* END FREE DONT SKIP AND DONT LOCK */
  } else return { skip: false, lock: true };
}
