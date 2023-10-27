import Queue from "bee-queue";

// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
// export const connection = new IORedis(process.env.REDIS_URL ?? "");
// redis.createClient({ url: process.env.REDIS_URL }),

export const queue = new Queue("introlines", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});

export const scrapingQueue = new Queue("scraper", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});

export const summarizeQueue = new Queue("summarizer", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});

export const generateQueue = new Queue("generate", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});

export const finishQueue = new Queue("finish", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});

export const retryQueue = new Queue("retry", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});
