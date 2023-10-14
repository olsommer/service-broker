"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billing = void 0;
const supabase_1 = require("../../utils/supabase");
const log_1 = require("../log");
async function billing(props) {
    const { job_id, count_gen_lines, count_file_rows, user_id, leads_job_id } = props;
    const { data: billData, error: billErr } = await supabase_1.supa
        .from("billings")
        .update({
        quantity_generated: count_gen_lines,
        quantity: count_file_rows,
    })
        .eq("job_id", job_id)
        .select();
    if (billErr)
        throw billErr;
    if (!billData)
        new Error("No billings found");
    // Get delta amount between quantity and quantity_generated
    if (!billData[0].quantity_generated || !billData[0].quantity) {
        throw new Error("No quantity");
    }
    const delta = Math.max(billData[0].quantity - billData[0].quantity_generated, 0);
    const carryover = billData[0].carryover ?? 0;
    // Get current credits
    const { data: rlData, error: rlErr } = await supabase_1.supa
        .from("ratelimits")
        .select("credits")
        .eq("id", user_id)
        .limit(1)
        .single();
    if (rlErr)
        throw rlErr;
    if (!rlData)
        throw new Error("No ratelimits found");
    const currentCredits = rlData.credits;
    const newCreditAmount = currentCredits + delta + carryover;
    const { error: bill2Err } = await supabase_1.supa
        .from("ratelimits")
        .update({
        credits: newCreditAmount,
    }).eq("id", user_id);
    if (bill2Err)
        throw bill2Err;
    await (0, log_1.log)("OK", { currentCredits, carryover, delta }, leads_job_id, "carryover and delta saved");
}
exports.billing = billing;
//# sourceMappingURL=index.js.map