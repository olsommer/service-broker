/* utils */

import { Tables } from "./utils/database.helpers";
/* tasks */
// import { DoneCallback, Job } from "bee-queue";

import { Worker } from "bullmq";
import { conn10, conn6, conn7, conn8, conn9 } from "./utils/bullmq";
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

/* scraping */
const scraperFile = path.join(__dirname, "./worker_scrape_thread.js");
const scraperWorker = new Worker("scraper", scraperFile, {
  connection: conn6,
  useWorkerThreads: true,
  concurrency: 6,
});

scraperWorker.on("ready", () => console.log(`Scrape Worker is ready`));
scraperWorker.on("stalled", (job) => console.log(`Scraper has stalled!`));
scraperWorker.on("drained", () => console.log(`Scraper drained`));
scraperWorker.on("paused", () => console.log(`Scraper drained`));
scraperWorker.on("error", (job) => console.log(`Scraper has an error!`));

scraperWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* summarize */
const sumFile = path.join(__dirname, "./worker_summarize_thread.js");
const sumWorker = new Worker("summarizer", sumFile, {
  connection: conn7,
  useWorkerThreads: true,
  concurrency: 2,
});

sumWorker.on("ready", () => console.log(`Summarize Worker is ready`));
sumWorker.on("stalled", (job) => console.log(`Summarizer has stalled!`));
sumWorker.on("drained", () => console.log(`Summarizer drained`));
sumWorker.on("paused", () => console.log(`Summarizer drained`));
sumWorker.on("error", (job) => console.log(`Summarizer has an error!`));
sumWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* generate */
const genFile = path.join(__dirname, "./worker_generate_thread.js");
const genWorker = new Worker("generate", genFile, {
  connection: conn8,
  useWorkerThreads: true,
  concurrency: 2,
});

genWorker.on("ready", () => console.log(`Line Generator Worker is ready`));
genWorker.on("stalled", (job) => console.log(`Generator has stalled!`));
genWorker.on("drained", () => console.log(`Generator drained`));
genWorker.on("paused", () => console.log(`Generator paused`));
genWorker.on("error", (job) => console.log(`Generator has an error!`));
genWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed: ${err.message}`);
});

/* finish */
const finFile = path.join(__dirname, "./worker_finish_thread.js");
const finWorker = new Worker("finish", finFile, {
  connection: conn9,
  useWorkerThreads: true,
  concurrency: 1,
});

finWorker.on("ready", () => console.log(`Finish Worker is ready`));
finWorker.on("stalled", (job) => console.log(`Finisher has stalled!`));
finWorker.on("drained", () => console.log(`Finisher drained`));
finWorker.on("paused", () => console.log(`Finisher paused`));
finWorker.on("error", (job) => console.log(`Finisher has an error!`));

finWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* retry */
const retFile = path.join(__dirname, "./worker_retry_thread.js");
const retWorker = new Worker("retry", retFile, {
  connection: conn10,
  useWorkerThreads: true,
  concurrency: 1,
});

retWorker.on("ready", () => console.log(`Retry Worker is ready`));

retWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
