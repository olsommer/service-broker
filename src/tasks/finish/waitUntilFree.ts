import { supa } from "../../utils/supabase";
import { setTimeout } from "timers/promises";

export async function waitUntilFree(job_id: string) {
  /* Get job data */
  const { data, error } = await supa
    .from("jobs")
    .select("is_blocked")
    .eq("id", job_id)
    .limit(1)
    .single();
  if (error) throw error;

  if (data.is_blocked == null) {
    /* Set job data and get it again (double check) */
    const { error: updateErr } = await supa
      .from("jobs")
      .update({ is_blocked: job_id })
      .eq("id", job_id);
    if (updateErr) throw updateErr;

    await setTimeout(Math.random() * (0.3) + 0.2 * 1000); // Wait for 0.5 seconds max

    /* Get job data */
    const { data: data2, error: error2 } = await supa
      .from("jobs")
      .select("is_blocked")
      .eq("id", job_id)
      .limit(1)
      .single();
    if (error2) throw error2;

    if (data2.is_blocked != job_id) {
      await waitUntilFree(job_id);
    } else {
      return; // all good
    }
  } else {
    await setTimeout(Math.random() * (0.8) + 0.2 * 1000); // Wait for 2 seconds
    await waitUntilFree(job_id);
  }
}
