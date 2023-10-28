import { SandboxedJob } from "bullmq";
import { scrape } from "./tasks/scrape";

module.exports = async (job: SandboxedJob) => {
  await scrape(job);
};
