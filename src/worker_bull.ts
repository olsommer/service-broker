import { FlagStates } from "./utils/states";
import { Tables } from "./utils/database.helpers";
import { scrape } from "./tasks/scrape";
import { summarize } from "./tasks/summarize";
import { generate } from "./tasks/generate_line";
import { log } from "./tasks/log";
import { finish } from "./tasks/finish";
import { retry } from "./tasks/retry";

import { Job, Worker } from "bullmq";

export type Payload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "UPDATE" | "INSERT";
  new: Tables<"leads_jobs">;
  old: Tables<"leads_jobs"> | null;
  errors: any[];
};

async function handle(job: Job) {
  const payload = job.data as Payload;

  console.log(`handling job: [${job.id}]`);
  console.log({ jobName: job.name, jobId: job.id, data: job.data });
  // console.log(
  //   `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
  // );
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
}

const worker = new Worker("ilProcess", handle);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

worker.on("error", (err) => {
  console.error(`Worker has errored with ${err.message}`);
});

// queue.process("ilProcess", 5, async (job, done) => {
//   // job.progress(42);
//   return handle(job);
// });
