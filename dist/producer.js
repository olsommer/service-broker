"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const supabase_1 = require("./utils/supabase");
const bee_1 = require("./utils/bee");
const channel = supabase_1.realtime.channel("#id");
channel.on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "leads_jobs",
}, 
// (payload) => handle(payload),
// (payload) => spawnChild(payload),
async (payload) => {
    await bee_1.queue.createJob(payload).save().then(async (job) => {
        await supabase_1.supa
            .from("leads_jobs")
            .update({
            job_collected: true,
        })
            .eq("id", payload.new.id);
    });
});
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
//# sourceMappingURL=producer.js.map