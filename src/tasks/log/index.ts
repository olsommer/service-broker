import { Json } from "../../utils/database.types";
import { supa } from "../../utils/supabase";

export async function log(
  status: "OK" | "ERROR",
  meta: Json,
  id: string,
  task: string,
) {
  const { error } = await supa
    .from("leads_jobs_logs")
    .insert({
      status,
      meta,
      ref_id: id,
      task,
    });
  if (error) throw error;
}
