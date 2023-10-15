"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* bullmq */
const bullmq_1 = require("bullmq");
/* utils */
const bull_1 = require("./utils/bull");
/* tasks */
const scrape_1 = require("./tasks/scrape");
const summarize_1 = require("./tasks/summarize");
const generate_line_1 = require("./tasks/generate_line");
const log_1 = require("./tasks/log");
const finish_1 = require("./tasks/finish");
const retry_1 = require("./tasks/retry");
async function handle(job) {
    const payload = job.data;
    // await job.updateProgress(42);
    job.log(`handling job: [${job.id}]`);
    return async () => {
        console.log({ jobName: job.name, jobId: job.id, data: job.data });
        console.log(`${payload.eventType} - ${payload.new.status} - ${payload.new.id}`);
        let id = "";
        try {
            const { new: record } = payload;
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
                    await (0, retry_1.retry)(record);
                    break;
            }
        }
        catch (error) {
            console.error(error);
            await (0, log_1.log)("ERROR", error.message, id, "task_manager");
        }
    };
}
const worker = new bullmq_1.Worker("ilProcess", async () => {
    console.log("lets go");
}, {
    connection: bull_1.connection,
});
worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
});
worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});
worker.on("error", (err) => {
    console.error(`Worker has errored with ${err.message}`);
});
//# sourceMappingURL=worker_bull.js.map