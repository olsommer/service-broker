import { log } from "../log";
import { closeJob } from "./closeJob";
import { setNextState } from "../next";
import { SandboxedJob } from "bullmq";
import { Payload } from "../../worker";

export async function retry(job: SandboxedJob<Payload, any>) {
  const { new: record } = job.data;
  const { id, tries, status_before } = record;
  try {
    if (tries < 3) {
      switch (status_before) {
        case ("FLAG_TO_SCRAPE"):
          await setNextState(id, "FLAG_TO_SCRAPE", tries + 1);
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
