/* utils */

import { Tables } from "./utils/database.helpers";
/* tasks */
// import { DoneCallback, Job } from "bee-queue";

import { Worker } from "bullmq";
import { connection } from "./utils/bullmq";
import path from "path";

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
// async function handle(job: Job<Payload, any, string>) {
//   const payload = job.data as Payload;
//   console.log(
//     `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
//   );

//   let id: string = "";
//   try {
//     const { new: record } = payload as Payload;
//     id = record.id;

//     switch (job.queueName) {
//       case ("scraper"):
//         await scrape(record);
//         break;
//       case ("summarizer"):
//         await summarize(record);
//         break;
//       case ("generate"):
//         await generate(record);
//         break;
//       case ("finish"):
//         await finish(record);
//         break;
//       case ("retry"):
//         await retry(record);
//         break;
//     }
//   } catch (error) {
//     console.error(error);
//     await log("ERROR", (error as Error).message, id, "task_manager");
//   }
// }

/* Handle Summarize */
// async function handleSummarize(job: Job<Payload>) {
//   const payload = job.data as Payload;
//   console.log(
//     `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
//   );

//   let id: string = "";
//   try {
//     const { new: record } = payload as Payload;
//     id = record.id;
//     await summarize(record);
//   } catch (error) {
//     console.error(error);
//     await log("ERROR", (error as Error).message, id, "task_manager");
//   }
// }

/* Handle Generate */
// async function handleGenerate(job: Job<Payload>) {
//   const payload = job.data as Payload;
//   console.log(
//     `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
//   );

//   let id: string = "";
//   try {
//     const { new: record } = payload as Payload;
//     id = record.id;
//     await generate(record);
//   } catch (error) {
//     console.error(error);
//     await log("ERROR", (error as Error).message, id, "task_manager");
//   }
// }

/* Handle Finish */
// async function handleRetry(job: Job<Payload>) {
//   const payload = job.data as Payload;
//   console.log(
//     `${payload.eventType} - ${payload.new.status} - ${payload.new.id}`,
//   );

//   let id: string = "";
//   try {
//     const { new: record } = payload as Payload;
//     id = record.id;
//     await retry(record);
//   } catch (error) {
//     console.error(error);
//     await log("ERROR", (error as Error).message, id, "task_manager");
//   }
// }

// queue.process(10, function (job: Job<Payload>, done: DoneCallback<any>) {
//   handle(job).then(() => done(null));
// });

// scrapingQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handle(job).then(() => done(null));
// });

// summarizeQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handleSummarize(job).then(() => done(null));
// });

// generateQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handleGenerate(job).then(() => done(null));
// });

// finishQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handleFinish(job).then(() => done(null));
// });

// retryQueue.process(1, (job: Job<Payload>, done: DoneCallback<any>) => {
//   handleRetry(job).then(() => done(null));
// });

/* scraping */
const scraperFile = path.join(__dirname, "./worker_scrape_thread.js");
const scraperWorker = new Worker("scraper", scraperFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 1,
});
// const scraperWorker = new Worker("scraper", async (job) => {
//   await scrape(job);
// }, { connection });

scraperWorker.on("ready", () => console.log(`Scrape Worker is ready`));

scraperWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

scraperWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* summarize */
const sumFile = path.join(__dirname, "./worker_summarize_thread.js");
const sumWorker = new Worker("summarizer", sumFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 3,
});
// const sumWorker = new Worker("summarizer", async (job) => {
//   await summarize(job);
// }, { connection });

sumWorker.on("ready", () => console.log(`Summarize Worker is ready`));

sumWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

sumWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* generate */
const genFile = path.join(__dirname, "./worker_generate_thread.js");
const genWorker = new Worker("scraper", genFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 3,
});
// const genWorker = new Worker("generate", async (job) => {
//   await generate(job);
// }, { connection });

genWorker.on("ready", () => console.log(`Line Generator Worker is ready`));

genWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

genWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* finish */
const finFile = path.join(__dirname, "./worker_finish_thread.js");
const finWorker = new Worker("finish", finFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 3,
});
// const finWorker = new Worker("finish", async (job) => {
//   await finish(job);
// }, { connection });

finWorker.on("ready", () => console.log(`Finish Worker is ready`));

finWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

finWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* retry */
const retFile = path.join(__dirname, "./worker_retry_thread.js");
const retWorker = new Worker("retry", retFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 2,
});
// const retWorker = new Worker("retry", async (job) => {
//   await retry(job);
// }, { connection });

retWorker.on("ready", () => console.log(`Retry Worker is ready`));

retWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

retWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
