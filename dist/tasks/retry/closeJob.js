"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeJob = void 0;
const log_1 = require("../log");
const supabase_1 = require("../../utils/supabase");
const billing_1 = require("../billing");
async function closeJob(record) {
    const { id, lead_id, job_id } = record;
    try {
        if (!lead_id)
            throw new Error("No lead provided");
        if (!job_id)
            throw new Error("No job provided");
        // Get job data
        // --------------------------------------
        const { data: jobData, error: jobErr } = await supabase_1.supa
            .from("jobs")
            .select("*")
            .eq("id", job_id)
            .limit(1)
            .single();
        if (jobErr)
            throw jobErr;
        if (!jobData)
            throw new Error("No data");
        if (!jobData.count_file_rows) {
            throw new Error("Could not could rows provided");
        }
        if (!jobData.user_id)
            throw new Error("Could not find user");
        // Update gen lines + 1
        const count_errors = (jobData.count_errors ?? 0) + 1;
        const count_gen_lines = jobData.count_gen_lines ?? 0;
        const count_file_rows = jobData.count_file_rows;
        // Finish job if last job
        // --------------------------------------
        if ((count_errors + count_gen_lines) === count_file_rows) {
            // Update job data
            const { error: job3Err } = await supabase_1.supa
                .from("jobs")
                .update({
                status: "DONE",
                count_errors,
            })
                .eq("id", job_id);
            if (job3Err)
                throw job3Err;
            // If Pro job, create billing
            if (jobData.product == "PRO") {
                await (0, billing_1.billing)({
                    job_id,
                    count_gen_lines,
                    count_file_rows,
                    user_id: jobData.user_id,
                    leads_job_id: id,
                });
            }
        }
        else {
            // Update job data
            // --------------------------------------
            const { error: job2Err } = await supabase_1.supa
                .from("jobs")
                .update({
                count_errors,
            })
                .eq("id", job_id);
            if (job2Err)
                throw job2Err;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            await (0, log_1.log)("ERROR", error.message, id, "retry finish");
        }
    }
}
exports.closeJob = closeJob;
//# sourceMappingURL=closeJob.js.map