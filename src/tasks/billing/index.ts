import { supa } from "../../utils/supabase";
import { log } from "../log";

interface Props {
  job_id: string;
  count_gen_lines: number;
  count_file_rows: number;
  user_id: string;
  leads_job_id: string;
}

export async function billing(props: Props) {
  const { job_id, count_gen_lines, count_file_rows, user_id, leads_job_id } =
    props;
  const { data: billData, error: billErr } = await supa
    .from("billings")
    .update({
      quantity_generated: count_gen_lines,
      quantity: count_file_rows,
    })
    .eq("job_id", job_id)
    .select("*")
    .limit(1)
    .single();
  if (billErr) throw billErr;
  if (!billData) new Error("No billings found");

  // Get delta amount between quantity and quantity_generated
  if (!billData.quantity_generated || !billData.quantity) {
    throw new Error("No quantity");
  }
  const delta = Math.max(
    billData.quantity - billData.quantity_generated,
    0,
  );
  const carryover = billData.carryover ?? 0;

  // Get current credits
  const { data: rlData, error: rlErr } = await supa
    .from("ratelimits")
    .select("credits")
    .eq("id", job_id)
    .limit(1)
    .single();
  if (rlErr) throw rlErr;
  if (!rlData) throw new Error("No ratelimits found");
  const currentCredits = rlData.credits;

  const newCreditAmount = currentCredits + delta + carryover;
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
    { currentCredits, carryover, delta },
    leads_job_id,
    "carryover and delta saved",
  );
}
