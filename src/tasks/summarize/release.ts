import { supa } from "../../utils/supabase";
import { setTimeout } from "timers/promises";

export async function release(lead_id: string) {
  const { error } = await supa
    .from("leads")
    .update({ is_blocked: null })
    .eq("id", lead_id);
  if (error) throw error;
}
