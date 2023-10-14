"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarize = void 0;
const log_1 = require("../log");
const supabase_1 = require("../../utils/supabase");
const openai_1 = require("../../utils/openai");
const next_1 = require("../next");
async function summarize(record) {
    const { id, job_id } = record;
    try {
        if (!job_id)
            throw new Error("No job id");
        // Get form data
        // --------------------------------------
        const { data: scrData, error: scrErr } = await supabase_1.supa
            .from("scrapes")
            .select("*")
            .eq("lead_job_id", id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
        if (scrErr)
            throw scrErr;
        if (!scrData || !scrData.content_cleaned)
            throw new Error("No data");
        const content_cleaned = scrData.content_cleaned;
        // Get job data
        // --------------------------------------
        const { data: jobsData, error: jobsErr } = await supabase_1.supa
            .from("jobs")
            .select("*")
            .eq("id", job_id)
            .limit(1)
            .single();
        if (jobsErr)
            throw jobsErr;
        if (!jobsData)
            throw new Error("No data");
        const form = jobsData.meta;
        // Clean HTML
        // --------------------------------------
        // const content_cleaned = convertToPlain(content);
        // Prompt Focus
        // --------------------------------------
        const focusPrompt = `Try to focus on ${form.focus ? form.focus : "compliments about the company"}.`;
        // Sending the cleaned version to OPEN-AI
        // --------------------------------------
        const prompt = `Scraped Website: ${content_cleaned}
      \n\n 
      Write a summary of a company based on the aboved scraped website. ${focusPrompt}
       This content will later be used to create an icebreaker. 
       Write at least 5 sentences.
       `;
        //
        const chatCompletion = await openai_1.openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            stream: false,
        });
        const summary = chatCompletion.choices[0].message.content;
        const meta = {
            model: chatCompletion.model,
            prompt_tokens: chatCompletion.usage?.prompt_tokens,
            completion_tokens: chatCompletion.usage?.completion_tokens,
            total_tokens: chatCompletion.usage?.total_tokens,
        };
        // Save the summary content to the database
        // --------------------------------------
        const { error } = await supabase_1.supa
            .from("summaries")
            .insert({
            content: summary,
            meta,
            type: "HOMEPAGE",
            lead_job_id: id,
        });
        if (error)
            throw error;
        await (0, next_1.setNextState)(id, "FLAG_TO_GENERATE");
    }
    catch (error) {
        console.log(error);
        await (0, log_1.log)("ERROR", error.message, id, "summarize");
    }
}
exports.summarize = summarize;
//# sourceMappingURL=index.js.map