import { FlagStates } from "./utils/states";
import { Tables } from "./utils/database.helpers";
import { scrape } from "./tasks/scrape";
import { summarize } from "./tasks/summarize";
import { generate } from "./tasks/generate_line";
import { log } from "./tasks/log";
import { finish } from "./tasks/finish";
import { retry } from "./tasks/retry";

export type Payload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "UPDATE" | "INSERT";
  new: Tables<"leads_jobs">;
  old: Tables<"leads_jobs"> | null;
  errors: any[];
};

export async function handle(payload: { [key: string]: any }) {
  console.log(payload);
  let id: string = "";
  try {
    const { new: record, old: old_record } = payload as Payload;
    id = record.id;

    switch (record.status as FlagStates) {
      case ("FLAG_TO_SCRAPE"):
        await scrape(record);
        break;
      case ("FLAG_TO_SUMMARIZE"):
        await summarize(record);
        break;
      case ("FLAG_TO_GENERATE"):
        await generate(record);
        break;
      case ("FLAG_TO_FINISH"):
        await finish(record);
        break;
      case ("DONE"):
        break;
      case ("FLAG_TO_RETRY"):
        // if (!old_record) throw new Error("No old_record provided");
        console.log("RETRY");
        // await retry(record, old_record);
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      await log("ERROR", error.message, id, "task_manager");
    }
  }
}
