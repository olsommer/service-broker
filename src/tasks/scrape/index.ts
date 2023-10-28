import axios from "axios";
import { log } from "../log";
import { isValidUrl } from "./isValid";
import { transformUrl } from "./transformUrl";
import { Tables } from "../../utils/database.helpers";
import { supa } from "../../utils/supabase";
import { setNextState } from "../next";
import { convertToPlain } from "./convertToPlain4";
import { Job } from "bullmq";
import { Payload } from "../../worker";

let tries = 0;

// Scraping job with ScraperAPI
// -------------------------------------------------
async function scraperAPI(tUrl: string): Promise<string> {
  const key = process.env.SCRAPER_API_KEY;
  const scUrl =
    `http://api.scraperapi.com/?api_key=${key}&url=${tUrl}&render=true`;

  const response = await axios.get(scUrl); // fire

  // Check if the response is valid
  if (response.status !== 200) {
    throw new Error("Response status is not 200 :" + response.statusText);
  }
  return response.data;
}

// Scraping job with ScraperAnt
// -------------------------------------------------
async function scraperAnt(tUrl: string) {
  const key = process.env.SCRAPER_ANT_KEY;
  const scUrl =
    `https://api.scrapingant.com/v2/general?url=${tUrl}&x-api-key=${key}`;

  const response = await axios.get(scUrl); // fire

  // Check if the response is valid
  if (response.status !== 200) {
    throw new Error("Response status is not 200 :" + response.statusText);
  }
  return response.data;
}

/* Main */
export async function scrape(job: Job<Payload, any, string>) {
  const { new: record } = job.data;
  const { id, lead_id } = record;
  try {
    if (!lead_id) throw new Error("No lead_id provided");

    // Get lead data
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
    if (isValidUrl(url) === false) {
      await log("ERROR", "result: invalid url", id, "scrape");
    }
    const tUrl = transformUrl(url);

    /* Scrape */
    let content: string | undefined = undefined;

    if (tries < 3) {
      content = await scraperAPI(tUrl);
    }

    if (tries >= 3 && tries <= 6) {
      content = await scraperAnt(tUrl);
    }

    if (tries > 6) {
      throw new Error("Could not scrape homepage");
    }

    if (!content) {
      await log("ERROR", "Content is empty", id, "scrape");
      throw new Error("Content is empty");
    }

    /* Clean */
    const content_cleaned = await convertToPlain(content);

    // Save the scraped content received from the scraper
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

    /* Error handling */
  } catch (error) {
    if (tries < 6) {
      await log(
        "ERROR",
        (error as Error).message,
        id,
        "Scraping Error - Retries: " + tries + "",
      );
      tries += 1;
      await scrape(job);
    } else {
      await log(
        "ERROR",
        (error as Error).message,
        id,
        "Could not scrape homepage or save scrape",
      );
      await setNextState(id, "FLAG_TO_RETRY", 3);
    }
  }
}
