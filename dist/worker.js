"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* utils */
const bee_1 = require("./utils/bee");
/* tasks */
const scrape_1 = require("./tasks/scrape");
const summarize_1 = require("./tasks/summarize");
const generate_line_1 = require("./tasks/generate_line");
const log_1 = require("./tasks/log");
const finish_1 = require("./tasks/finish");
const retry_1 = require("./tasks/retry");
async function handle(job) {
    const payload = job.data;
    console.log(`${payload.eventType} - ${payload.new.status} - ${payload.new.id}`);
    let id = "";
    try {
        const { new: record } = payload;
        id = record.id;
        const was = (before) => {
            return record.status_before === before ||
                record.status_before === "FLAG_TO_RETRY";
        };
        switch (record.status) {
            case ("FLAG_TO_SCRAPE"):
                if (was(null))
                    await (0, scrape_1.scrape)(record);
                break;
            case ("FLAG_TO_SUMMARIZE"):
                if (was("FLAG_TO_SCRAPE"))
                    await (0, summarize_1.summarize)(record);
                break;
            case ("FLAG_TO_GENERATE"):
                if (was("FLAG_TO_SUMMARIZE"))
                    await (0, generate_line_1.generate)(record);
                break;
            case ("FLAG_TO_FINISH"):
                if (was("FLAG_TO_FINISH"))
                    await (0, finish_1.finish)(record);
                break;
            case ("DONE"):
                break;
            case ("FLAG_TO_RETRY"):
                await (0, retry_1.retry)(record);
                break;
        }
    }
    catch (error) {
        console.error(error);
        await (0, log_1.log)("ERROR", error.message, id, "task_manager");
    }
}
bee_1.queue.process(function (job, done) {
    handle(job).then(() => done(null));
});
//# sourceMappingURL=worker.js.map