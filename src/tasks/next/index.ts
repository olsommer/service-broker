import { supa } from "../../utils/supabase";
import { log } from "../log";
import { FlagStates } from "../../utils/states";

export async function setNextState(
  id: string,
  status: FlagStates,
  tries?: number,
) {
  const { error } = await supa
    .from("leads_jobs")
    .update({
      status,
      tries,
    })
    .eq("id", id);
  if (error) throw error;
  await log("OK", status, id, "next state");
}
