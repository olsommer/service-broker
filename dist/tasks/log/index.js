"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const supabase_1 = require("../../utils/supabase");
async function log(status, meta, id, task) {
    const { error } = await supabase_1.supa
        .from("leads_jobs_logs")
        .insert({
        status,
        meta,
        ref_id: id,
        task,
    });
    if (error)
        throw error;
}
exports.log = log;
//# sourceMappingURL=index.js.map