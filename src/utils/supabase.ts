// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
import { RealtimeClient } from "@supabase/realtime-js";
import { createClient } from "@supabase/supabase-js";

// import { Database } from "./db_types.ts";
import { Database } from "./database.types";

const rturl = "wss://ndxhivyksquaghuolyig.supabase.co/realtime/v1";
// wss://[project-ref].supabase.co/realtime/v1/websocket?apikey=[anon-token]&log_level=info&vsn=1.0.0
const url = "https://ndxhivyksquaghuolyig.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGhpdnlrc3F1YWdodW9seWlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjI3NjEyNywiZXhwIjoyMDA3ODUyMTI3fQ.hRHgz6ZomMHf7RlKUp1JeoYx0frcvqELHxof4GN9RRk";

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
