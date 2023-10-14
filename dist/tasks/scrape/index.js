"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const axios_1 = __importDefault(require("axios"));
const log_1 = require("../log");
const isValid_1 = require("./isValid");
const transformUrl_1 = require("./transformUrl");
const supabase_1 = require("../../utils/supabase");
async function scrape(record) {
    const { id, lead_id } = record;
    try {
        if (!lead_id)
            throw new Error("No lead_id provided");
        const uuid = crypto.randomUUID();
        // Get lead data
        // --------------------------------------
        const { data: leadData, error: leadErr } = await supabase_1.supa
            .from("leads")
            .select("*")
            .eq("id", lead_id)
            .limit(1)
            .single();
        if (leadErr)
            throw leadErr;
        if (!leadData)
            throw new Error("No data");
        const url = leadData.lead.Website;
        if (!url)
            throw new Error("Website URL is empty or null");
        // Transform url
        // -------------------------------------------------
        if ((0, isValid_1.isValidUrl)(url) === false) {
            await (0, log_1.log)("ERROR", "result: invalid url", id, "scrape");
        }
        const tUrl = (0, transformUrl_1.transformUrl)(url);
        // Scraping job
        // -------------------------------------------------
        const callbackURL = `https://ndxhivyksquaghuolyig.supabase.co/functions/v1/webhook?scrapeId=${uuid}&leadJobId=${id}`;
        const key = process.env.SCRAPER_API_KEY;
        const body = {
            apiKey: key,
            url: tUrl,
            callback: {
                type: "webhook",
                url: callbackURL,
            },
        };
        const reqURL = "https://async.scraperapi.com/jobs";
        // -------------------------------------------------
        axios_1.default.post(reqURL, body, {
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            await (0, log_1.log)("OK", res.data, id, "scrape");
            //
            //
            // Add dummy scrape but without any content
            const { error } = await supabase_1.supa
                .from("scrapes")
                .insert({
                id: uuid,
                lead_job_id: id,
                log_request: res.data,
                log_callback_url: callbackURL,
            });
            if (error)
                throw error;
            //
            /* Error handling */
        }).catch((err) => {
            throw err;
        });
        //
        /* Error handling */
    }
    catch (error) {
        await (0, log_1.log)("ERROR", error.message, id, "scrape");
    }
}
exports.scrape = scrape;
//# sourceMappingURL=index.js.map