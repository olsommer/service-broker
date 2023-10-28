import { SandboxedJob } from "bullmq";
import { generate } from "./tasks/generate_line";
import { scrape } from "./tasks/scrape";

module.exports = async (job: SandboxedJob) => {
  await scrape(job);
};
