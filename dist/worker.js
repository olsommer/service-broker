"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const scrape_1 = require("./tasks/scrape");
const summarize_1 = require("./tasks/summarize");
const generate_line_1 = require("./tasks/generate_line");
const log_1 = require("./tasks/log");
const finish_1 = require("./tasks/finish");
async function handle(payload) {
    console.log(payload);
    let id = "";
    try {
        const { new: record, old: old_record } = payload;
        id = record.id;
        switch (record.status) {
            case ("FLAG_TO_SCRAPE"):
                await (0, scrape_1.scrape)(record);
                break;
            case ("FLAG_TO_SUMMARIZE"):
                await (0, summarize_1.summarize)(record);
                break;
            case ("FLAG_TO_GENERATE"):
                await (0, generate_line_1.generate)(record);
                break;
            case ("FLAG_TO_FINISH"):
                await (0, finish_1.finish)(record);
                break;
            case ("DONE"):
                break;
            case ("FLAG_TO_RETRY"):
                // if (!old_record) throw new Error("No old_record provided");
                console.log("RETRY");
                // await retry(record, old_record);
                break;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            await (0, log_1.log)("ERROR", error.message, id, "task_manager");
        }
    }
}
exports.handle = handle;
//# sourceMappingURL=worker.js.map