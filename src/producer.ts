import "dotenv/config";
import { realtime, supa } from "./utils/supabase";
import { queue } from "./utils/bee";
import { Tables } from "./utils/database.helpers";

const channel = realtime.channel("#id");

channel.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "leads_jobs",
  },
  // (payload) => handle(payload),
  // (payload) => spawnChild(payload),
  async (payload) => {
    await queue.createJob(payload).save().then(async (job) => {
      await supa
        .from("leads_jobs")
        .update({
          job_collected: true,
        })
        .eq("id", (payload.new as Tables<"leads_jobs">).id);
    });
  },
);

channel.subscribe((status, err) => {
  if (status === "SUBSCRIBED") {
    console.log("Connected!");
  }

  if (status === "CHANNEL_ERROR") {
    console.log(`There was an error subscribing to channel: ${err?.message}`);
  }

  if (status === "TIMED_OUT") {
    console.log("Realtime server did not respond in time.");
  }

  if (status === "CLOSED") {
    console.log("Realtime channel was unexpectedly closed.");
  }
});
