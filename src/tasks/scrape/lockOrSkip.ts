import { supa } from "../../utils/supabase";
import { setTimeout } from "timers/promises";
import { setNextState } from "../next";
import { generateQueue } from "../../utils/bullmq";

export async function lockOrSkip(
  leads_job_id: string,
  lead_id: string,
): Promise<{ skip: boolean }> {
  let skip = false;
  while (true) {
    /* Get job data */
    const { data, error } = await supa
      .from("leads_jobs")
      .select("is_blocked")
      .eq("id", leads_job_id)
      .limit(1)
      .single();
    if (error) throw error;

    if (data.is_blocked == null) {
      /* Get lead data */
      const { data: lead, error: leadErr } = await supa
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .limit(1)
        .single();
      if (leadErr) throw leadErr;

      if (lead.website_summary == null) {
        /* Set job data and get it again (double check) */
        const { error: updateErr } = await supa
          .from("leads_jobs")
          .update({ is_blocked: leads_job_id })
          .eq("id", leads_job_id);
        if (updateErr) throw updateErr;

        await setTimeout(Math.random() * (0.3) + 0.2 * 1000); // Wait for 0.5 seconds max

        /* Get job data */
        const { data: data2, error: error2 } = await supa
          .from("leads_jobs")
          .select("is_blocked")
          .eq("id", leads_job_id)
          .limit(1)
          .single();
        if (error2) throw error2;

        if (data2.is_blocked == leads_job_id) {
          skip = false;
          break;
        }
      } else {
        skip = true;
        break;
      }
    } else {
      await setTimeout(Math.random() * (0.8) + 0.2 * 1000); // Wait for 2 seconds
    }
  }
  return { skip };
}
