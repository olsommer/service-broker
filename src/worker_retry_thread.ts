import { SandboxedJob } from "bullmq";
import { retry } from "./tasks/retry";

module.exports = async (job: SandboxedJob) => {
  await retry(job);
};
