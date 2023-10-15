import Queue from "bee-queue";
import redis from "redis";

// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
// export const connection = new IORedis(process.env.REDIS_URL ?? "");

//  redis.createClient({ url: process.env.REDIS_URL }),

export const queue = new Queue("introlines", {
  isWorker: false,
  redis: process.env.REDIS_URL,
});

//{
// connection,
// defaultJobOptions: {
//   removeOnComplete: true,
//   removeOnFail: 1000,
// },
// redis: process.env.REDIS_URL,
// limiter: {
//   max: 1000,
//   duration: 5000,
// },
// defaultJobOptions: {
//   removeOnComplete: true,
//   removeOnFail: true,
// },
//}
