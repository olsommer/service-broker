import { log } from "../log";
import { Tables } from "../../utils/database.helpers";
import { closeJob } from "./closeJob";
import { setNextState } from "../next";
import { supa } from "../../utils/supabase";

export async function retry(
  record: Tables<"leads_jobs">,
) {
  const { id, tries, status_before } = record;
  try {
    if (tries < 3) {
      switch (status_before) {
        case ("FLAG_TO_SCRAPE"):
          {
            // Get current credits
            const { data: rlData, error: rlErr } = await supa
              .from("scrapes")
              .select("*")
              .eq("lead_job_id", id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();
            if (rlErr) throw rlErr;
            if (rlData) {
              await setNextState(id, "FLAG_TO_SUMMARIZE", tries + 1);
            } else {
              await setNextState(id, "FLAG_TO_SCRAPE", tries + 1);
            }
          }
          break;
        case ("FLAG_TO_SUMMARIZE"):
          await setNextState(id, "FLAG_TO_SUMMARIZE", tries + 1);
          break;
        case ("FLAG_TO_GENERATE"):
          await setNextState(id, "FLAG_TO_GENERATE", tries + 1);
          break;
        case ("FLAG_TO_RETRY"):
          await setNextState(id, "FLAG_TO_SCRAPE", tries + 1);
          break;
      }
    } else {
      await closeJob(record);
      await setNextState(id, "ERROR_TIMEOUT");
    }
  } catch (error) {
    console.log(error);
    await log("ERROR", (error as Error).message, id, "retry");
  }
}
