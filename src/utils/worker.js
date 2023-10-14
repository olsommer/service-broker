import { FlagStates } from "./utils/states";
import { Tables } from "./utils/database.helpers";
import { scrape } from "./tasks/scrape";
import { summarize } from "./tasks/summarize";
import { generate } from "./tasks/generate_line";
import { log } from "./tasks/log";
import { finish } from "./tasks/finish";
import { retry } from "./tasks/retry";

export async function handle(payload) {
  console.log(payload);
  let id = "";
  try {
    const { new: record, old: old_record } = payload;
    id = record.id;

    switch (record.status) {
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
    console.error(error.message);
    await log("ERROR", error.message, id, "task_manager");
  }
}
