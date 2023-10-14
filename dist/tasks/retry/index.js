"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const log_1 = require("../log");
const closeJob_1 = require("./closeJob");
const next_1 = require("../next");
const supabase_1 = require("../../utils/supabase");
async function retry(record) {
    const { id, tries, status_before } = record;
    try {
        if (tries < 3) {
            switch (status_before) {
                case ("FLAG_TO_SCRAPE"):
                    {
                        // Get current credits
                        const { data: rlData, error: rlErr } = await supabase_1.supa
                            .from("scrapes")
                            .select("*")
                            .eq("lead_job_id", id)
                            .order("created_at", { ascending: false })
                            .limit(1)
                            .single();
                        if (rlErr)
                            throw rlErr;
                        if (rlData) {
                            await (0, next_1.setNextState)(id, "FLAG_TO_SUMMARIZE", tries + 1);
                        }
                        else {
                            await (0, next_1.setNextState)(id, "FLAG_TO_SCRAPE", tries + 1);
                        }
                    }
                    break;
                case ("FLAG_TO_SUMMARIZE"):
                    await (0, next_1.setNextState)(id, "FLAG_TO_SUMMARIZE", tries + 1);
                    break;
                case ("FLAG_TO_GENERATE"):
                    await (0, next_1.setNextState)(id, "FLAG_TO_GENERATE", tries + 1);
                    break;
                case ("FLAG_TO_RETRY"):
                    await (0, next_1.setNextState)(id, "FLAG_TO_SCRAPE", tries + 1);
                    break;
            }
        }
        else {
            await (0, closeJob_1.closeJob)(record);
            await (0, next_1.setNextState)(id, "ERROR_TIMEOUT");
        }
    }
    catch (error) {
        console.log(error);
        await (0, log_1.log)("ERROR", error.message, id, "retry");
    }
}
exports.retry = retry;
//# sourceMappingURL=index.js.map