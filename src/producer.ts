import "dotenv/config";
import { realtime, supa } from "./utils/supabase";
import {
  finishQueue,
  generateQueue,
  queue,
  retryQueue,
  scrapingQueue,
  summarizeQueue,
} from "./utils/bee";
import { Tables } from "./utils/database.helpers";
import { Payload } from "./worker";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Job } from "bee-queue";

/* check the status before */
const was = (
  record: Payload["new"],
  before: Tables<"leads_jobs">["status"],
) => {
  return record.status_before === before ||
    record.status_before === "FLAG_TO_RETRY";
};

/* confirm delivery */
const delivered = async (
  job: Job<RealtimePostgresChangesPayload<{ [key: string]: any }>>,
) => {
  const i = job.data.new as Tables<"leads_jobs">;
  await supa
    .from("leads_jobs")
    .update({
      job_collected: true,
    })
    .eq("id", i.id);
};
/* Route */
async function route(
  payload: RealtimePostgresChangesPayload<{ [key: string]: any }>,
) {
  const { new: record } = payload as Payload;

  switch (record.status) {
    case ("FLAG_TO_SCRAPE"):
      if (was(record, null)) {
        await scrapingQueue.createJob(payload).save().then(delivered);
      }
      break;
    case ("FLAG_TO_SUMMARIZE"):
      if (was(record, "FLAG_TO_SCRAPE")) {
        await summarizeQueue.createJob(payload).save().then(delivered);
      }
      break;
    case ("FLAG_TO_GENERATE"):
      if (was(record, "FLAG_TO_SUMMARIZE")) {
        await generateQueue.createJob(payload).save().then(delivered);
      }
      break;
    case ("FLAG_TO_FINISH"):
      if (was(record, "FLAG_TO_GENERATE")) {
        await finishQueue.createJob(payload).save().then(delivered);
      }
      break;
    case ("FLAG_TO_RETRY"):
      await retryQueue.createJob(payload).save().then(delivered);
      break;
    case ("DONE"):
      break;
  }
}
//

/* Listen to new joins */
const channel = realtime.channel("any");
channel.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "leads_jobs",
    filter: `job_collected=eq.FALSE`,
  },
  async (payload) => route(payload),
);

channel.subscribe((status, err) => {
  if (status === "SUBSCRIBED") {
    console.log("Connected!");
  }

  if (status === "CHANNEL_ERROR") {
    console.log(`There was an error subscribing to channel: ${err}`);
  }

  if (status === "TIMED_OUT") {
    console.log("Realtime server did not respond in time.");
  }

  if (status === "CLOSED") {
    console.log("Realtime channel was unexpectedly closed.");
  }
});
