import { supa } from "../../utils/supabase";
import { log } from "../log";
import { reportUsage } from "./reportUsage";

interface Props {
  job_id: string;
  count_gen_lines: number;
  expected_lines: number;
  user_id: string;
  leads_job_id: string;
}

export async function billing(props: Props) {
  const { job_id, count_gen_lines, expected_lines, user_id, leads_job_id } =
    props;

  // Get current credits
  const { data: subData, error: subError } = await supa
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .limit(1)
    .single();

  if (subError || !subData || !subData.subscription_item_id) {
    const { data: billData, error: billErr } = await supa
      .from("billings")
      .update({
        quantity_generated: count_gen_lines,
        quantity: expected_lines,
        report_usage_error: "No profile or subscription found ",
      })
      .eq("job_id", job_id)
      .select();
    if (billErr) throw billErr;
    if (!billData) new Error("No billings found");
    throw subError || new Error("No profiles found");
  }

  // Report Usage to Stripe
  const { error, idempotencyKey } = await reportUsage(
    subData.subscription_item_id,
    expected_lines,
  );

  // Update billing data
  const { data: billData, error: billErr } = await supa
    .from("billings")
    .update({
      quantity_generated: count_gen_lines,
      quantity: expected_lines,
      report_usage_error: error?.message,
      report_usage_idempotency_key: idempotencyKey,
    })
    .eq("job_id", job_id)
    .select();
  if (billErr) throw billErr;
  if (!billData) new Error("No billings found");
}
