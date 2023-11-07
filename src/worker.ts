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

/* scraping */
const scraperFile = path.join(__dirname, "./worker_scrape_thread.js");
const scraperWorker = new Worker("scraper", scraperFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 10,
});
// const scraperWorker = new Worker("scraper", async (job) => {
//   await scrape(job);
// }, { connection });

scraperWorker.on("ready", () => console.log(`Scrape Worker is ready`));

scraperWorker.on("completed", (job) => {
  console.log(`${job.name}:${job.queueName}:${job.id} has completed!`);
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
  console.log(`${job.name}:${job.queueName}:${job.id} has completed!`);
});

sumWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* generate */
const genFile = path.join(__dirname, "./worker_generate_thread.js");
const genWorker = new Worker("generate", genFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 3,
});
// const genWorker = new Worker("generate", async (job) => {
//   await generate(job);
// }, { connection });

genWorker.on("ready", () => console.log(`Line Generator Worker is ready`));

genWorker.on("completed", (job) => {
  console.log(`${job.name}:${job.queueName}:${job.id} has completed!`);
});

genWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* finish */
const finFile = path.join(__dirname, "./worker_finish_thread.js");
const finWorker = new Worker("finish", finFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 1,
});
// const finWorker = new Worker("finish", async (job) => {
//   await finish(job);
// }, { connection });

finWorker.on("ready", () => console.log(`Finish Worker is ready`));

finWorker.on("completed", (job) => {
  console.log(`${job.name}:${job.queueName}:${job.id} has completed!`);
});

finWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

/* retry */
const retFile = path.join(__dirname, "./worker_retry_thread.js");
const retWorker = new Worker("retry", retFile, {
  connection,
  useWorkerThreads: true,
  concurrency: 1,
});
// const retWorker = new Worker("retry", async (job) => {
//   await retry(job);
// }, { connection });

retWorker.on("ready", () => console.log(`Retry Worker is ready`));

retWorker.on("completed", (job) => {
  console.log(`${job.name}:${job.queueName}:${job.id} has completed!`);
});

retWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
