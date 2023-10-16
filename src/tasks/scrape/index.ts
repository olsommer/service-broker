import { log } from "../log";
import { isValidUrl } from "./isValid";
import { transformUrl } from "./transformUrl";
import { Tables } from "../../utils/database.helpers";
import { supa } from "../../utils/supabase";
import { setNextState } from "../next";
import { convertToPlain } from "./convertToPlain4";
import axios from "axios";

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
    // request Axios
    const key = process.env.SCRAPER_API_KEY;
    const scUrl =
      `http://api.scraperapi.com/?api_key=${key}&url=${tUrl}&render=true`;

    axios.get(scUrl).then(async (response) => {
      await log("OK", response.data, id, "scrape");
      // // If the status is not "finished", return an error
      // if (response.statusCode !== 200) {
      //   await log("ERROR", response, scrapeId, "scrape_callback");
      // // TODO: Better error handling here
      // }
      const content = response.data;
      try {
        await log("OK", content, id, "scrape");
        // Clean the HTML
        const content_cleaned = await convertToPlain(content);

        await log("OK", content_cleaned, id, "scrape");
        // Save the scraped content received from the scraper
        // -------------------------------------------------
        const { data: scrCurrData, error } = await supa
          .from("scrapes")
          .insert({
            lead_job_id: id,
            log_request: tUrl,
            log_callback_url: "",
            content,
            content_cleaned,
          })
          .select();
        if (error) throw error;
        if (!scrCurrData) throw new Error("No data");
        await setNextState(id, "FLAG_TO_SUMMARIZE");
      } catch (err) {
        // If the status is not "finished", return an error
        await log("ERROR", err as any, lead_id, "could not scrape url");
      }
    }).catch(async (err) => {
      // If the status is not "finished", return an error
      await log("ERROR", err, lead_id, "could not scrape url");
      // TODO: Better error handling here
    });
    //
    /* Error handling */
  } catch (error) {
    await log("ERROR", (error as Error).message, id, "scrape");
  }
}
