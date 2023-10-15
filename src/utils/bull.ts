import { Queue } from "bullmq";
export const queue = new Queue("introlines", {
  connection: {
    host: "ec2-52-51-176-162.eu-west-1.compute.amazonaws.com",
    password:
      "peb687183a55fafff3be0835c38df7e6f3a961831ee445bd73d79e518040a2c68",
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
