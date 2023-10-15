import "dotenv/config";
import { spawnChild } from "./utils/spawn";
import { realtime } from "./utils/supabase";
import { handle } from "./worker";
import { queue } from "./utils/bull";

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
  async (payload) => await queue.createJob(payload).save(),
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
