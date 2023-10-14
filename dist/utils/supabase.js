"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supa = exports.realtime = void 0;
// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
const realtime_js_1 = require("@supabase/realtime-js");
const supabase_js_1 = require("@supabase/supabase-js");
const rturl = "wss://ndxhivyksquaghuolyig.supabase.co/realtime/v1";
// wss://[project-ref].supabase.co/realtime/v1/websocket?apikey=[anon-token]&log_level=info&vsn=1.0.0
const url = "https://ndxhivyksquaghuolyig.supabase.co";
const key = process.env.SUPA_API_KEY;
if (!url)
    throw new Error("Missing url");
if (!key)
    throw new Error("Missing service role key");
/* Supabase Realtime Client */
exports.realtime = new realtime_js_1.RealtimeClient(rturl, {
    params: {
        apikey: key,
        reconnect: true,
    },
});
/* Supabase Client */
exports.supa = (0, supabase_js_1.createClient)(url, key);
//# sourceMappingURL=supabase.js.map