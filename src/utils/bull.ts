import Bull from "bull";
export const queue: Bull.Queue = new Bull("introlines", {
  redis: process.env.REDIS_URL,
  limiter: {
    max: 1000,
    duration: 5000,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
