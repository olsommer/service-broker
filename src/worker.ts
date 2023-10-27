/* utils */
import {
  finishQueue,
  generateQueue,
  retryQueue,
  scrapingQueue,
  summarizeQueue,
} from "./utils/bee";
import { Tables } from "./utils/database.helpers";
/* tasks */
import { scrape } from "./tasks/scrape";
import { summarize } from "./tasks/summarize";
import { generate } from "./tasks/generate_line";
import { log } from "./tasks/log";
import { finish } from "./tasks/finish";
import { retry } from "./tasks/retry";
import { DoneCallback, Job } from "bee-queue";

export type Payload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "UPDATE" | "INSERT";
  new: Tables<"leads_jobs">;
  old: Tables<"leads_jobs"> | null;
  errors: any[];
};

// const was = (
//   record: Payload["new"],
//   before: Tables<"leads_jobs">["status"],
// ) => {
//   return record.status_before === before ||
//     record.status_before === "FLAG_TO_RETRY";
// };

// async function ___old_handle(job: Job<Payload>) {
//   const payload = job.data as Payload;
//   console.log(
//     `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
//   );

//   let id: string = "";
//   try {
//     const { new: record } = payload as Payload;
//     id = record.id;

//     // const was = (before: Tables<"leads_jobs">["status"]) => {
//     //   return record.status_before === before ||
//     //     record.status_before === "FLAG_TO_RETRY";
//     // };

//     switch (record.status) {
//       // case ("FLAG_TO_SCRAPE"):
//       //   if (was(record, null)) await scrape(record);
//       //   break;
//       case ("FLAG_TO_SUMMARIZE"):
//         if (was(record, "FLAG_TO_SCRAPE")) await summarize(record);
//         break;
//       case ("FLAG_TO_GENERATE"):
//         if (was(record, "FLAG_TO_SUMMARIZE")) await generate(record);
//         break;
//       case ("FLAG_TO_FINISH"):
//         if (was(record, "FLAG_TO_GENERATE")) await finish(record);
//         break;
//       case ("DONE"):
//         break;
//       case ("FLAG_TO_RETRY"):
//         await retry(record);
//         break;
//     }
//   } catch (error) {
//     console.error(error);
//     await log("ERROR", (error as Error).message, id, "task_manager");
//   }
// }

/* Handle Scraping */
async function handle(job: Job<Payload>) {
  const payload = job.data as Payload;
  console.log(
    `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
  );

  let id: string = "";
  try {
    const { new: record } = payload as Payload;
    id = record.id;

    switch (job.queue.name) {
      case ("scraper"):
        await scrape(record);
        break;
      case ("summarizer"):
        await summarize(record);
        break;
      case ("generate"):
        await generate(record);
        break;
      case ("finish"):
        await finish(record);
        break;
      case ("retry"):
        await retry(record);
        break;
    }
  } catch (error) {
    console.error(error);
    await log("ERROR", (error as Error).message, id, "task_manager");
  }
}

// queue.process(10, function (job: Job<Payload>, done: DoneCallback<any>) {
//   handle(job).then(() => done(null));
// });

scrapingQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
  handle(job).then(() => done(null));
});

summarizeQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
  handle(job).then(() => done(null));
});

generateQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
  handle(job).then(() => done(null));
});

finishQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
  handle(job).then(() => done(null));
});

// retryQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handle(job).then(() => done(null));
// });
