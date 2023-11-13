/* utils */

import { Tables } from "./utils/database.helpers";
/* tasks */
// import { DoneCallback, Job } from "bee-queue";

import { Worker } from "bullmq";
import {
  conn1,
  conn2,
  conn3,
  conn4,
  conn5,
  finishQ,
  generateQ,
  scraperQ,
  summarizeQ,
} from "./utils/bullmq";
import { finish } from "./tasks/finish";
import { generate } from "./tasks/generate_line";
import { summarize } from "./tasks/summarize";
import { scrape } from "./tasks/scrape";

export type Payload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "UPDATE" | "INSERT";
  new: Tables<"leads_jobs">;
  old: Tables<"leads_jobs"> | null;
  errors: any[];
};

/* scraping */
// const scraperFile = path.join(__dirname, "./worker_scrape_thread.js");
// const scraperWorker = new Worker("scraper", scraperFile, {
const scraperWorker = new Worker(scraperQ, scrape, {
  connection: conn1,
  // useWorkerThreads: true,
  concurrency: 3,
});

scraperWorker.on("ready", () => console.log(`Scrape Worker is ready`));
scraperWorker.on("error", (job) => console.log(`Scraper has an error!`));
scraperWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* summarize */
// const sumFile = path.join(__dirname, "./worker_summarize_thread.js");
// const sumWorker = new Worker("summarizer", sumFile, {
const sumWorker = new Worker(summarizeQ, summarize, {
  connection: conn2,
  // useWorkerThreads: true,
  concurrency: 2,
});

sumWorker.on("ready", () => console.log(`Summarize Worker is ready`));
sumWorker.on("error", (job) => console.log(`Summarizer has an error!`));
sumWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* generate */
// const genFile = path.join(__dirname, "./worker_generate_thread.js");
// const genWorker = new Worker("generate", genFile, {
const genWorker = new Worker(generateQ, generate, {
  connection: conn3,
  // useWorkerThreads: true,
  concurrency: 2,
});

genWorker.on("ready", () => console.log(`Line Generator Worker is ready`));
genWorker.on("error", (job) => console.log(`Generator has an error!`));
genWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed: ${err.message}`);
});

/* finish */
// const finFile = path.join(__dirname, "./worker_finish_thread.js");
// const finWorker = new Worker("finish", finFile, {
const finWorker = new Worker(finishQ, finish, {
  connection: conn4,
  // useWorkerThreads: true,
  concurrency: 1,
});

finWorker.on("ready", () => console.log(`Finish Worker is ready`));
finWorker.on("error", (job) => console.log(`Finisher has an error!`));
finWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* retry */
// const retFile = path.join(__dirname, "./worker_retry_thread.js");
// const retWorker = new Worker("retry", retFile, {
//   connection: conn5,
//   useWorkerThreads: true,
//   concurrency: 1,
// });

// retWorker.on("ready", () => console.log(`Retry Worker is ready`));

// retWorker.on("failed", (job, err) => {
//   console.log(`${job?.id} has failed with ${err.message}`);
// });
