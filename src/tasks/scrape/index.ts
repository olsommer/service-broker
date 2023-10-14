import axios from "axios";
import { log } from "../log";
import { isValidUrl } from "./isValid";
import { transformUrl } from "./transformUrl";
import { Tables } from "../../utils/database.helpers";
import { supa } from "../../utils/supabase";
import { Json } from "../../utils/database.types";

export async function scrape(record: Tables<"leads_jobs">) {
  const { id, lead_id } = record;
  try {
    if (!lead_id) throw new Error("No lead_id provided");
    const uuid = crypto.randomUUID();

    // Get lead data
    // --------------------------------------
    const { data: leadData, error: leadErr } = await supa
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .limit(1)
      .single();
    if (leadErr) throw leadErr;
    if (!leadData) throw new Error("No data");
    const url = (leadData.lead as { Website?: string }).Website;
    if (!url) throw new Error("Website URL is empty or null");

    // Transform url
    // -------------------------------------------------
    if (isValidUrl(url) === false) {
      await log("ERROR", "result: invalid url", id, "scrape");
    }
    const tUrl = transformUrl(url);

    // Scraping job
    // -------------------------------------------------
    const callbackURL =
      `https://ndxhivyksquaghuolyig.supabase.co/functions/v1/webhook?scrapeId=${uuid}&leadJobId=${id}`;
    const key = "69113361a61d29ac2e511e2fa563f2bf";
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
    axios.post(reqURL, body, {
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      await log("OK", res as any, id, "scrape");
      //
      //
      // Add dummy scrape but without any content
      const { error } = await supa
        .from("scrapes")
        .insert({
          id: uuid,
          lead_job_id: id,
          log_request: res,
          log_callback_url: callbackURL,
        });
      if (error) throw error;
      //
      /* Error handling */
    }).catch((err) => {
      throw err;
    });
    //
    /* Error handling */
  } catch (error) {
    await log("ERROR", error.message, id, "scrape");
  }
}
