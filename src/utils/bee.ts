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

export const scrapingQueue = new Queue("introlinesScraper", {
  isWorker: true,
  redis: process.env.REDIS_URL,
  removeOnSuccess: true,
  removeOnFailure: true,
});
