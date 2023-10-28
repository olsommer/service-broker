import { Queue } from "bullmq";
import { Redis } from "ioredis";

// !!! Make sure that your redis instance has the setting
// !!! maxmemory-policy=noeviction
// !!! in order to avoid automatic removal of keys which would cause unexpected errors in BullMQ

export const connection = new Redis(process.env.REDIS_URL ?? "");

export const scrapingQueue = new Queue("scraper", { connection });
