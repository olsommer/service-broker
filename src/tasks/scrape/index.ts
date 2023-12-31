import axios from "axios";
import { log } from "../log";
import { isValidUrl } from "./isValid";
import { transformUrl } from "./transformUrl";
import { supa } from "../../utils/supabase";
import { setNextState } from "../next";
import { convertToPlain } from "./convertToPlain4";
import { Job } from "bullmq";
import { Payload } from "../../worker";
import {
  generateQ,
  generateQueue,
  scraperQ,
  scrapingQueue,
  summarizeQ,
  summarizeQueue,
} from "../../utils/bullmq";
import { lockOrSkip } from "./lockOrSkip";
import { handleError } from "../next/handleError";

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

// Scraping job with ScraperService
// -------------------------------------------------
async function scraperService(tUrl: string) {
  const scUrl =
    `https://scraper-service-127d759d0c0e.herokuapp.com/scrape?url=${tUrl}`;

  const response = await axios.get(scUrl); // fire

  // Check if the response is valid
  if (response.status !== 200) {
    throw new Error("Response status is not 200 :" + response.statusText);
  }
  return response.data;
}

/* Main */
export async function scrape(job: Job<Payload, any>) {
  const { new: record } = job.data;
  const { id, lead_id } = record;
  try {
    if (!id) throw new Error("No lead_jobs_id provided");
    if (!lead_id) throw new Error("No lead_id provided");

    const { skip, lock } = await lockOrSkip(id, lead_id);
    if (lock) {
      setTimeout(() => {
        scrapingQueue.add(scraperQ, job.data, {
          removeOnComplete: true,
          removeOnFail: true,
          delay: 5000,
        });
      }, 5000);
    } else if (skip) {
      await setNextState(id, "FLAG_TO_GENERATE", "FLAG_TO_SCRAPE");
      generateQueue.add(generateQ, job.data, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    }

    /* ELSE: SCRAPE */
    if (!skip && !lock) {
      await handleScrape(job);
    }
  } catch (error) {
    await log(
      "ERROR",
      (error as Error).message,
      id,
      "Could not scrape homepage",
    );
    await setNextState(id, "ERROR_TIMEOUT", "FLAG_TO_SCRAPE");
  }
}

async function handleScrape(job: Job<Payload, any>) {
  const { new: record } = job.data;
  const { id, lead_id } = record;
  let content: string | undefined = undefined;
  let url = null;
  if (!id) throw new Error("No lead_jobs_id provided");
  if (!lead_id) throw new Error("No lead_id provided");

  try {
    // Get lead data
    const { data: leadData, error: leadErr } = await supa
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .limit(1)
      .single();
    if (leadErr) throw leadErr;

    // Get url
    url = leadData.website;
    if (!url) throw new Error("Website URL is empty or null");

    // Transform url
    if (isValidUrl(url) === false) {
      throw new Error("result: invalid url");
    }
  } catch (error) {
    handleError(job, error, "FLAG_TO_SCRAPE", tries);
  }

  try {
    // Get url
    if (!url) throw new Error("Website URL is empty or null");

    const tUrl = transformUrl(url);

    /* Scrape */
    if (tries < 3) {
      content = await scraperService(tUrl);
    }

    if (tries >= 3 && tries <= 6) {
      content = await scraperAnt(tUrl);
    }

    if (tries > 6) {
      throw new Error("Could not scrape homepage");
    }

    if (!content) {
      throw new Error("Content is empty");
    }
  } catch (error) {
    if (tries < 6) {
      await log(
        "ERROR",
        (error as Error).message,
        id,
        "Scraping Error - Retries: " + tries + "",
      );
      tries += 1;
      await handleScrape(job);
    } else {
      handleError(job, error, "FLAG_TO_SCRAPE", tries);
    }
  }

  try {
    if (!content) throw new Error("Content is empty");

    /* Clean */
    const content_cleaned = await convertToPlain(content);

    /* Save scrapes to db */
    const { error: updateLeads } = await supa
      .from("leads")
      .update({
        website_content: null,
        website_content_cleaned: content_cleaned,
      })
      .eq("id", lead_id);
    if (updateLeads) throw updateLeads;

    /* Add next job */
    summarizeQueue.add(summarizeQ, job.data, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    await setNextState(id, "FLAG_TO_SUMMARIZE", "FLAG_TO_SCRAPE");
  } catch (error) {
    handleError(job, error, "FLAG_TO_SCRAPE", tries);
  }
}
