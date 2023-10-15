import { FlagStates } from "./utils/states";
import { Tables } from "./utils/database.helpers";
import { scrape } from "./tasks/scrape";
import { summarize } from "./tasks/summarize";
import { generate } from "./tasks/generate_line";
import { log } from "./tasks/log";
import { finish } from "./tasks/finish";
import { retry } from "./tasks/retry";
import { queue } from "./utils/bull";
import Bull from "bull";

export type Payload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "UPDATE" | "INSERT";
  new: Tables<"leads_jobs">;
  old: Tables<"leads_jobs"> | null;
  errors: any[];
};

queue.process("ilProcess", 5, async (job, done) => {
  // job.progress(42);
  return handle(job);
});

const handle = async (job: Bull.Job) => {
  const payload = job.data as Payload;

  console.log(
    `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
  );
  let id: string = "";
  try {
    const { new: record } = payload as Payload;
    id = record.id;

    switch (record.status as FlagStates) {
      case ("FLAG_TO_SCRAPE"):
        await scrape(record);
        break;
      case ("FLAG_TO_SUMMARIZE"):
        await summarize(record);
        break;
      case ("FLAG_TO_GENERATE"):
        await generate(record);
        break;
      case ("FLAG_TO_FINISH"):
        await finish(record);
        break;
      case ("DONE"):
        break;
      case ("FLAG_TO_RETRY"):
        await retry(record);
        break;
    }
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "task_manager");
  }
};

queue.on("completed", (job, result) => {
  console.log(`Job completed with result ${result}`);
});
