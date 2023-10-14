// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
import { RealtimeClient } from "@supabase/realtime-js";
import { createClient } from "@supabase/supabase-js";

// import { Database } from "./db_types.ts";
import { Database } from "./database.types";

const rturl = "wss://ndxhivyksquaghuolyig.supabase.co/realtime/v1";
// wss://[project-ref].supabase.co/realtime/v1/websocket?apikey=[anon-token]&log_level=info&vsn=1.0.0
const url = "https://ndxhivyksquaghuolyig.supabase.co";
const key = process.env.SUPA_API_KEY;

if (!url) throw new Error("Missing url");
if (!key) throw new Error("Missing service role key");

/* Supabase Realtime Client */
export const realtime = new RealtimeClient(rturl, {
  params: {
    apikey: key,
    reconnect: true,
  },
});

/* Supabase Client */
export const supa = createClient<Database>(url, key);
