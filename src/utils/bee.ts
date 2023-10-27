import Queue from "bee-queue";

// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
// export const connection = new IORedis(process.env.REDIS_URL ?? "");
// redis.createClient({ url: process.env.REDIS_URL }),

const sharedConfig = {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
};

// export const queue = new Queue("introlines", {
//   isWorker: true,
//   redis: process.env.REDIS_URL,
//   removeOnSuccess: true,
//   removeOnFailure: true,
// });

export const scrapingQueue = new Queue("scraper", sharedConfig);
export const summarizeQueue = new Queue("summarizer", sharedConfig);
export const generateQueue = new Queue("generate", sharedConfig);
// export const finishQueue = new Queue("finish", sharedConfig);
export const retryQueue = new Queue("retry", sharedConfig);
