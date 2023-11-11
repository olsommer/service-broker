import "dotenv/config";
import { realtime, supa } from "./utils/supabase";
import { Tables } from "./utils/database.helpers";
import { Payload } from "./worker";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Job } from "bullmq";
import {
  finishQueue,
  generateQueue,
  retryQueue,
  scrapingQueue,
  summarizeQueue,
} from "./utils/bullmq";
import { setNextState } from "./tasks/next";
import { lockOrSkip } from "./tasks/scrape/lockOrSkip";

/* check the status before */
const was = (
  record: Payload["new"],
  before: Tables<"leads_jobs">["status"],
) => {
  return record.status_before === before ||
    record.status_before === "FLAG_TO_RETRY";
};

/* confirm delivery */
export const delivered = async (
  job: Job<Payload, any, string>,
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
        scrapingQueue.add("scraper", payload, {
          removeOnComplete: true,
          removeOnFail: true,
        }).then(delivered);
      }
      break;
      // case ("FLAG_TO_SUMMARIZE"):
      //   if (was(record, "FLAG_TO_SCRAPE")) {
      //     summarizeQueue.add("summarizeJob", payload, {
      //       removeOnComplete: true,
      //       removeOnFail: true,
      //     }).then(delivered);
      //   }
      //   break;
      // case ("FLAG_TO_GENERATE"):
      //   if (was(record, "FLAG_TO_SUMMARIZE")) {
      //     generateQueue.add("generateJob", payload, {
      //       removeOnComplete: true,
      //       removeOnFail: true,
      //     }).then(delivered);
      //   }
      //   break;
      // case ("FLAG_TO_FINISH"):
      //   if (was(record, "FLAG_TO_GENERATE")) {
      //     finishQueue.add("finishJob", payload, {
      //       removeOnComplete: true,
      //       removeOnFail: true,
      //     }).then(delivered);
      //   }
      //   break;
      // case ("FLAG_TO_RETRY"):
      //   retryQueue.add("retryJob", payload, {
      //     removeOnComplete: true,
      //     removeOnFail: true,
      //   }).then(delivered);
      //   break;
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
  async (payload) => await route(payload),
);

channel.subscribe((status, err) => {
  if (status === "SUBSCRIBED") {
    console.log("Realtime is connected!");
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
