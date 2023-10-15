import Queue from "bee-queue";
import redis from "redis";

// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
// export const connection = new IORedis(process.env.REDIS_URL ?? "");

const config = {
  getEvents: false,
  isWorker: false,
  redis: redis.createClient({ url: process.env.REDIS_URL }),
};

export const queue = new Queue("introlines", config);

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
