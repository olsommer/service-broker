import { Queue } from "bullmq";
export const queue = new Queue("introlines", {
  connection: {
    host: process.env.REDIS_URL,
    port: 19090,
  },
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
