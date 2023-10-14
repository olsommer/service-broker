"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const supabase_1 = require("./utils/supabase");
const worker_1 = require("./worker");
const channel = supabase_1.realtime.channel("#id");
channel.on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "leads_jobs",
}, (payload) => (0, worker_1.handle)(payload));
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
//# sourceMappingURL=index.js.map