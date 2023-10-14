"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNextState = void 0;
const supabase_1 = require("../../utils/supabase");
const log_1 = require("../log");
async function setNextState(id, status, tries) {
    const { error } = await supabase_1.supa
        .from("leads_jobs")
        .update({
        status,
        tries,
    })
        .eq("id", id);
    if (error)
        throw error;
    await (0, log_1.log)("OK", status, id, "next state");
}
exports.setNextState = setNextState;
//# sourceMappingURL=index.js.map