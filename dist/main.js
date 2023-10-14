var $jZMcD$child_process = require("child_process");
var $jZMcD$axios = require("axios");
var $jZMcD$supabaserealtimejs = require("@supabase/realtime-js");
var $jZMcD$supabasesupabasejs = require("@supabase/supabase-js");
var $jZMcD$openai = require("openai");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}


// WARNING: The service role key has admin priviliges and should only be used in secure server environments!


const $19920bad422f0bb2$var$rturl = "wss://ndxhivyksquaghuolyig.supabase.co/realtime/v1";
// wss://[project-ref].supabase.co/realtime/v1/websocket?apikey=[anon-token]&log_level=info&vsn=1.0.0
const $19920bad422f0bb2$var$url = "https://ndxhivyksquaghuolyig.supabase.co";
const $19920bad422f0bb2$var$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGhpdnlrc3F1YWdodW9seWlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjI3NjEyNywiZXhwIjoyMDA3ODUyMTI3fQ.hRHgz6ZomMHf7RlKUp1JeoYx0frcvqELHxof4GN9RRk";
if (!$19920bad422f0bb2$var$url) throw new Error("Missing url");
if (!$19920bad422f0bb2$var$key) throw new Error("Missing service role key");
const $19920bad422f0bb2$export$ea80eb855ab064f8 = new (0, $jZMcD$supabaserealtimejs.RealtimeClient)($19920bad422f0bb2$var$rturl, {
    params: {
        apikey: $19920bad422f0bb2$var$key,
        reconnect: true
    }
});
const $19920bad422f0bb2$export$e40e0db08f6c644f = (0, $jZMcD$supabasesupabasejs.createClient)($19920bad422f0bb2$var$url, $19920bad422f0bb2$var$key);


async function $a4e0c77f633e416d$export$bef1f36f5486a6a3(status, meta, id, task) {
    const { error: error } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("leads_jobs_logs").insert({
        status: status,
        meta: meta,
        ref_id: id,
        task: task
    });
    if (error) throw error;
}


function $81f4223fb3da852e$export$bef94a5618bf18bf(url) {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
    return urlPattern.test(url);
}


function $b1e28e1395f6cc2c$export$f784c93c2c19988(inputUrl) {
    // Remove 'https://' or 'http://' if present
    let transformedUrl = inputUrl.replace(/^(https?:\/\/)/, "");
    // Remove 'www.' if present
    transformedUrl = transformedUrl.replace(/^www\./, "");
    // Add 'https://' back if the input URL had it
    if (inputUrl.startsWith("https://")) transformedUrl = "https://" + transformedUrl;
    else if (inputUrl.startsWith("http://")) transformedUrl = "http://" + transformedUrl;
    return transformedUrl;
}



async function $0dfe712be313046e$export$6c0ecc2862ebf379(record) {
    const { id: id, lead_id: lead_id } = record;
    try {
        if (!lead_id) throw new Error("No lead_id provided");
        const uuid = crypto.randomUUID();
        // Get lead data
        // --------------------------------------
        const { data: leadData, error: leadErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("leads").select("*").eq("id", lead_id).limit(1).single();
        if (leadErr) throw leadErr;
        if (!leadData) throw new Error("No data");
        const url = leadData.lead.Website;
        if (!url) throw new Error("Website URL is empty or null");
        // Transform url
        // -------------------------------------------------
        if ((0, $81f4223fb3da852e$export$bef94a5618bf18bf)(url) === false) await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", "result: invalid url", id, "scrape");
        const tUrl = (0, $b1e28e1395f6cc2c$export$f784c93c2c19988)(url);
        // Scraping job
        // -------------------------------------------------
        const callbackURL = `https://ndxhivyksquaghuolyig.supabase.co/functions/v1/webhook?scrapeId=${uuid}&leadJobId=${id}`;
        const key = "69113361a61d29ac2e511e2fa563f2bf";
        const body = {
            apiKey: key,
            url: tUrl,
            callback: {
                type: "webhook",
                url: callbackURL
            }
        };
        const reqURL = "https://async.scraperapi.com/jobs";
        // -------------------------------------------------
        (0, ($parcel$interopDefault($jZMcD$axios))).post(reqURL, body, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res)=>{
            await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("OK", res, id, "scrape");
            //
            //
            // Add dummy scrape but without any content
            const { error: error } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("scrapes").insert({
                id: uuid,
                lead_job_id: id,
                log_request: res,
                log_callback_url: callbackURL
            });
            if (error) throw error;
        //
        /* Error handling */ }).catch((err)=>{
            throw err;
        });
    //
    /* Error handling */ } catch (error) {
        await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", error.message, id, "scrape");
    }
}





const $11a59547a2577d36$export$464f99bcbd6e7094 = new (0, ($parcel$interopDefault($jZMcD$openai)))({
    apiKey: "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"
});




async function $7aec9f2f80fc47f3$export$5a8b80f35baeb72c(id, status, tries) {
    const { error: error } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("leads_jobs").update({
        status: status,
        tries: tries
    }).eq("id", id);
    if (error) throw error;
    await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("OK", status, id, "next state");
}


async function $66a5d00e3d64bc80$export$1e70e29ad6d71f19(record) {
    const { id: id, job_id: job_id } = record;
    try {
        if (!job_id) throw new Error("No job id");
        // Get form data
        // --------------------------------------
        const { data: scrData, error: scrErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("scrapes").select("*").eq("lead_job_id", id).order("created_at", {
            ascending: false
        }).limit(1).single();
        if (scrErr) throw scrErr;
        if (!scrData || !scrData.content_cleaned) throw new Error("No data");
        const content_cleaned = scrData.content_cleaned;
        // Get job data
        // --------------------------------------
        const { data: jobsData, error: jobsErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("jobs").select("*").eq("id", job_id).limit(1).single();
        if (jobsErr) throw jobsErr;
        if (!jobsData) throw new Error("No data");
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
        const chatCompletion = await (0, $11a59547a2577d36$export$464f99bcbd6e7094).chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
            stream: false
        });
        const summary = chatCompletion.choices[0].message.content;
        const meta = {
            model: chatCompletion.model,
            prompt_tokens: chatCompletion.usage?.prompt_tokens,
            completion_tokens: chatCompletion.usage?.completion_tokens,
            total_tokens: chatCompletion.usage?.total_tokens
        };
        // Save the summary content to the database
        // --------------------------------------
        const { error: error } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("summaries").insert({
            content: summary,
            meta: meta,
            type: "HOMEPAGE",
            lead_job_id: id
        });
        if (error) throw error;
        await (0, $7aec9f2f80fc47f3$export$5a8b80f35baeb72c)(id, "FLAG_TO_GENERATE");
    } catch (error) {
        console.log(error);
        await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", error.message, id, "summarize");
    }
}






async function $1ac1e0ae6caa28da$export$80d376111cc09ad7(record) {
    const { id: id, lead_id: lead_id, job_id: job_id } = record;
    try {
        if (!job_id) throw new Error("No job id");
        // Get form data
        // --------------------------------------
        const { data: jobsData, error: jobsErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("jobs").select("*").eq("id", job_id).limit(1).single();
        if (jobsErr) throw jobsErr;
        if (!jobsData) throw new Error("No data");
        const form = jobsData.meta;
        // Get summary data
        // --------------------------------------
        const { data: sumData, error: sumErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("summaries").select("*").eq("lead_job_id", id).order("created_at", {
            ascending: false
        }).limit(1).single();
        if (sumErr) throw sumErr;
        if (!sumData || !sumData.content) throw new Error("No data");
        const content = sumData.content;
        // --------------------------------------
        const focus = form.focus ?? "Compliments about the company";
        const industryPrompt = form.industry ? `The prospects industry is ${form.industry}.` : "";
        const templates = ()=>{
            const _focus = form.focus;
            switch(form.focus){
                case "Mock referral":
                    return `Please use one of the following templates: 
          """{top connection name} referred me to you so I thought I'd reach out.""" \n 
          """I got your contact info from {top connection name}."""`;
                case "Compliments about company":
                    return `Please use one of the following templates: 
          """I really like the {service/product} you guys are doing/selling at {company}."""\n 
          """It's really impressive to see all the {products/services} you guys are offering at {company}."""`;
                case "Trends and challenges of industry":
                    return `Please use one of the following templates: 
          """I've been tracking the {industry} industry closely, and it's evident that companies are grappling with the challenge of {specific challenge}."""\n 
          """The {industry} sector has always fascinated me, and the current trend of {specific trend} has piqued my interest."""`;
                case "Things in common":
                    return `Please use one of the following templates: 
          """I saw that we have {common interest} thing in common."""\n
          """I couldn't help but notice our shared interest in {common interest}."""`;
                case "Looking for their service mock":
                    return `Please use one of the following templates: 
          """I was looking for {service/product} and I came across {company}."""
          """Earlier, I was searching for {service/product} and I stumbled across your company, {company}."""`;
            }
        };
        // Sending the cleaned version to OPEN-AI
        // Prompts
        // Neither generate questions nor exclamation marks.
        // Make it as personal as possible by using the summary of the scraped homepage.
        const prompt = `Summary of the scraped homepage: ${content}. 
    \n\n
    Instruction: Above is a summary of the scraped homepage. 
    Write a personalized icebreaker (only the first two lines of a cold email) based on the scraped homepage. ${industryPrompt}
    The goal is to act like a genuine person writing this personalized icebreaker so that there is a higher response from the cold email.
    Write in a authentic, realistic, less flattering, down to earth and casual tone. 
    Write a maximum of two shorter sentences.
    Only output raw trimmed text.
    ${templates()}
    \n\n
    `;
        // --------------------------------------
        console.log(prompt);
        const chatCompletion = await (0, $11a59547a2577d36$export$464f99bcbd6e7094).chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
            stream: false
        });
        const generated_line = chatCompletion.choices[0].message.content;
        const meta = {
            model: chatCompletion.model,
            prompt_tokens: chatCompletion.usage?.prompt_tokens,
            completion_tokens: chatCompletion.usage?.completion_tokens,
            total_tokens: chatCompletion.usage?.total_tokens
        };
        // --------------------------------------
        // Save to the database
        // --------------------------------------
        const { error: error } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("lines").insert({
            content: generated_line,
            meta: meta,
            active: true,
            lead_id: lead_id,
            lead_job_id: id
        }).order("created_at", {
            ascending: false
        });
        if (error) throw error;
        await (0, $7aec9f2f80fc47f3$export$5a8b80f35baeb72c)(id, "FLAG_TO_FINISH");
    } catch (error) {
        console.error(error);
        await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", error.message, id, "generate");
    }
}








async function $67c0e8b064fdbe0d$export$d87cfcc979a5825c(props) {
    const { job_id: job_id, count_gen_lines: count_gen_lines, count_file_rows: count_file_rows, user_id: user_id, leads_job_id: leads_job_id } = props;
    const { data: billData, error: billErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("billings").update({
        quantity_generated: count_gen_lines,
        quantity: count_file_rows
    }).eq("job_id", job_id).select("*").limit(1).single();
    if (billErr) throw billErr;
    if (!billData) new Error("No billings found");
    // Get delta amount between quantity and quantity_generated
    if (!billData.quantity_generated || !billData.quantity) throw new Error("No quantity");
    const delta = Math.max(billData.quantity - billData.quantity_generated, 0);
    const carryover = billData.carryover ?? 0;
    // Get current credits
    const { data: rlData, error: rlErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("ratelimits").select("credits").eq("id", job_id).limit(1).single();
    if (rlErr) throw rlErr;
    if (!rlData) throw new Error("No ratelimits found");
    const currentCredits = rlData.credits;
    const newCreditAmount = currentCredits + delta + carryover;
    const { error: bill2Err } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("ratelimits").update({
        credits: newCreditAmount
    }).eq("id", user_id);
    if (bill2Err) throw bill2Err;
    await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("OK", {
        currentCredits: currentCredits,
        carryover: carryover,
        delta: delta
    }, leads_job_id, "carryover and delta saved");
}


async function $7b97d96b9cdff879$export$5953b28951b32649(record) {
    const { id: id, lead_id: lead_id, job_id: job_id } = record;
    try {
        if (!lead_id) throw new Error("No lead provided");
        if (!job_id) throw new Error("No job provided");
        // Get job data
        // --------------------------------------
        const { data: jobData, error: jobErr } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("jobs").select("*").eq("id", job_id).limit(1).single();
        if (jobErr) throw jobErr;
        if (!jobData) throw new Error("No data");
        if (!jobData.count_file_rows) throw new Error("Could not could rows provided");
        if (!jobData.user_id) throw new Error("Could not find user");
        // Update gen lines + 1
        const count_errors = jobData.count_errors ?? 0;
        const count_file_rows = jobData.count_file_rows;
        const count_gen_lines = (jobData.count_gen_lines ?? 0) + 1;
        // Finish job if last job
        // --------------------------------------
        if (count_errors + count_gen_lines === count_file_rows) {
            // Update job data
            // --------------------------------------
            const { error: job3Err } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("jobs").update({
                status: "DONE",
                count_gen_lines: count_gen_lines
            }).eq("id", job_id);
            if (job3Err) throw job3Err;
            // If Pro job, create billing
            if (jobData.product == "PRO") await (0, $67c0e8b064fdbe0d$export$d87cfcc979a5825c)({
                job_id: job_id,
                count_gen_lines: count_gen_lines,
                count_file_rows: count_file_rows,
                user_id: jobData.user_id,
                leads_job_id: id
            });
        } else {
            // Update job data
            // --------------------------------------
            const { error: job2Err } = await (0, $19920bad422f0bb2$export$e40e0db08f6c644f).from("jobs").update({
                count_gen_lines: count_gen_lines
            }).eq("id", job_id);
            if (job2Err) throw job2Err;
        }
        // Set the next state
        // --------------------------------------
        await (0, $7aec9f2f80fc47f3$export$5a8b80f35baeb72c)(id, "DONE");
    } catch (error) {
        console.log(error);
        await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", error.message, id, "finish");
    }
}


async function $04580f7d8c481d21$export$8f34ce051745d39e(payload) {
    console.log(payload);
    let id = "";
    try {
        const { new: record, old: old_record } = payload;
        id = record.id;
        switch(record.status){
            case "FLAG_TO_SCRAPE":
                await (0, $0dfe712be313046e$export$6c0ecc2862ebf379)(record);
                break;
            case "FLAG_TO_SUMMARIZE":
                await (0, $66a5d00e3d64bc80$export$1e70e29ad6d71f19)(record);
                break;
            case "FLAG_TO_GENERATE":
                await (0, $1ac1e0ae6caa28da$export$80d376111cc09ad7)(record);
                break;
            case "FLAG_TO_FINISH":
                await (0, $7b97d96b9cdff879$export$5953b28951b32649)(record);
                break;
            case "DONE":
                break;
            case "FLAG_TO_RETRY":
                // if (!old_record) throw new Error("No old_record provided");
                console.log("RETRY");
                break;
        }
    } catch (error) {
        console.error(error.message);
        await (0, $a4e0c77f633e416d$export$bef1f36f5486a6a3)("ERROR", error.message, id, "task_manager");
    }
}


const $ffe21ffd9afd10dc$export$94672d1f46a84401 = (payload)=>{
    const payloadString = JSON.stringify(payload);
    const child = (0, $jZMcD$child_process.spawn)("node", [
        "-e",
        `(${(0, $04580f7d8c481d21$export$8f34ce051745d39e).toString()})(JSON.parse('${payloadString}'))`
    ], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
    });
    //   const child = spawn("node", ["./worker.js", payloadString]);
    //   child.stdout.setEncoding("utf8");
    //   child.stdout.on("data", (data) => {
    //     console.log(`stdout: ${data}`);
    //   });
    //   child.stderr.on("data", (data) => {
    //     console.log(`stdout: ${data}`);
    //   });
    // Handle process events
    child.on("exit", (code, signal)=>{
        if (code === 0) console.log("Worker finished successfully.");
        else console.error(`Worker failed with code ${code} and signal ${signal}.`);
    });
};



const $8bfaa5924e7a5eff$var$channel = (0, $19920bad422f0bb2$export$ea80eb855ab064f8).channel("#id");
$8bfaa5924e7a5eff$var$channel.on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "leads_jobs"
}, (payload)=>(0, $ffe21ffd9afd10dc$export$94672d1f46a84401)(payload));
$8bfaa5924e7a5eff$var$channel.subscribe((status, err)=>{
    if (status === "SUBSCRIBED") console.log("Connected!");
    if (status === "CHANNEL_ERROR") console.log(`There was an error subscribing to channel: ${err?.message}`);
    if (status === "TIMED_OUT") console.log("Realtime server did not respond in time.");
    if (status === "CLOSED") console.log("Realtime channel was unexpectedly closed.");
});


//# sourceMappingURL=main.js.map
