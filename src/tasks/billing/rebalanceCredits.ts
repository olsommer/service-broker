import { supa } from "../../utils/supabase";
import { log } from "../log";

export async function rebalanceCredits(
  count_gen_lines: number,
  expected_lines: number,
  user_id: string,
  leads_job_id: string,
) {
  const delta = Math.max(
    expected_lines - count_gen_lines,
    0,
  );

  // Get current credits
  const { data: rlData, error: rlErr } = await supa
    .from("ratelimits")
    .select("credits")
    .eq("id", user_id)
    .limit(1)
    .single();
  if (rlErr) throw rlErr;
  const currentCredits = rlData.credits;

  const newCreditAmount = currentCredits + delta;
  const { error: bill2Err } = await supa
    .from("ratelimits")
    .update(
      {
        credits: newCreditAmount,
      },
    ).eq("id", user_id);
  if (bill2Err) throw bill2Err;
  await log(
    "OK",
    { newCreditAmount, delta },
    leads_job_id,
    "rebalance saved",
  );
}
