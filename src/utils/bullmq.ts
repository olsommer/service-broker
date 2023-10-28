import { Queue } from "bullmq";
import { Redis } from "ioredis";

// !!! Make sure that your redis instance has the setting
// !!! maxmemory-policy=noeviction
// !!! in order to avoid automatic removal of keys which would cause unexpected errors in BullMQ

export const connection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
});

export const scrapingQueue = new Queue("scraper", { connection });
export const summarizeQueue = new Queue("summarizer", { connection });
export const generateQueue = new Queue("generate", { connection });
export const finishQueue = new Queue("finish", { connection });
export const retryQueue = new Queue("retry", { connection });
