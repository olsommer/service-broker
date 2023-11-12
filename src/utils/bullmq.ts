import { Queue } from "bullmq";
import { Redis } from "ioredis";

// !!! Make sure that your redis instance has the setting
// !!! maxmemory-policy=noeviction
// !!! in order to avoid automatic removal of keys which would cause unexpected errors in BullMQ

export const conn1 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
  sentinelMaxConnections: 1,
});

export const conn2 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
  sentinelMaxConnections: 1,
});

export const conn3 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
  sentinelMaxConnections: 1,
});

export const conn4 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
  sentinelMaxConnections: 1,
});

export const conn5 = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
  sentinelMaxConnections: 1,
});

export const scraperQ = "scraper";
export const summarizeQ = "summarizer";
export const generateQ = "generate";
export const finishQ = "finish";
export const retryQ = "retry";

export const scrapingQueue = new Queue(scraperQ, { connection: conn1 });
export const summarizeQueue = new Queue(summarizeQ, { connection: conn2 });
export const generateQueue = new Queue(generateQ, { connection: conn3 });
export const finishQueue = new Queue(finishQ, { connection: conn4 });
export const retryQueue = new Queue(retryQ, { connection: conn5 });
