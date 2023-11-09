import { Queue } from "bullmq";
import { Redis } from "ioredis";

// !!! Make sure that your redis instance has the setting
// !!! maxmemory-policy=noeviction
// !!! in order to avoid automatic removal of keys which would cause unexpected errors in BullMQ

export const conn1 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
  sentinelMaxConnections: 20,
});

export const conn2 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
  sentinelMaxConnections: 20,
});

export const conn3 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
  sentinelMaxConnections: 20,
});

export const conn4 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
  sentinelMaxConnections: 20,
});

export const conn5 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
  sentinelMaxConnections: 20,
});

export const scrapingQueue = new Queue("scraper", { connection: conn1 });
export const summarizeQueue = new Queue("summarizer", { connection: conn2 });
export const generateQueue = new Queue("generate", { connection: conn3 });
export const finishQueue = new Queue("finish", { connection: conn4 });
export const retryQueue = new Queue("retry", { connection: conn5 });
