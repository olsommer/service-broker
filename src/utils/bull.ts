import { Queue } from "bullmq";
import IORedis from "ioredis";

// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
export const connection = new IORedis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: 0,
});

export const queue = new Queue("introlines", {
  connection,
  // redis: process.env.REDIS_URL,
  // limiter: {
  //   max: 1000,
  //   duration: 5000,
  // },
  // defaultJobOptions: {
  //   removeOnComplete: true,
  //   removeOnFail: true,
  // },
});
