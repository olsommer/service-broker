# Details

Date : 2023-10-31 01:37:13

Directory /Users/oliversommer/Projects/leadX/introlines/services/service-broker/src

Total : 39 files,  2087 codes, 444 comments, 263 blanks, all 2794 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/index.ts](/src/index.ts) | TypeScript | 34 | 6 | 8 | 48 |
| [src/producer.ts](/src/producer.ts) | TypeScript | 103 | 5 | 8 | 116 |
| [src/tasks/billing/index.ts](/src/tasks/billing/index.ts) | TypeScript | 55 | 3 | 7 | 65 |
| [src/tasks/finish/index.ts](/src/tasks/finish/index.ts) | TypeScript | 60 | 10 | 5 | 75 |
| [src/tasks/generate_line/__index.ts](/src/tasks/generate_line/__index.ts) | TypeScript | 98 | 13 | 14 | 125 |
| [src/tasks/generate_line/__index_ext_provider.ts](/src/tasks/generate_line/__index_ext_provider.ts) | TypeScript | 117 | 18 | 14 | 149 |
| [src/tasks/generate_line/cot_compliments_about_company.ts](/src/tasks/generate_line/cot_compliments_about_company.ts) | TypeScript | 42 | 0 | 2 | 44 |
| [src/tasks/generate_line/cot_industry_challenge.ts](/src/tasks/generate_line/cot_industry_challenge.ts) | TypeScript | 42 | 0 | 2 | 44 |
| [src/tasks/generate_line/cot_looking_for_their_service_mock.ts](/src/tasks/generate_line/cot_looking_for_their_service_mock.ts) | TypeScript | 42 | 0 | 2 | 44 |
| [src/tasks/generate_line/cot_refined_compliments_about_company.ts](/src/tasks/generate_line/cot_refined_compliments_about_company.ts) | TypeScript | 42 | 0 | 2 | 44 |
| [src/tasks/generate_line/cot_refined_industry_challenge.ts](/src/tasks/generate_line/cot_refined_industry_challenge.ts) | TypeScript | 42 | 0 | 2 | 44 |
| [src/tasks/generate_line/cot_refined_looking_for_their_service_mock.ts](/src/tasks/generate_line/cot_refined_looking_for_their_service_mock.ts) | TypeScript | 53 | 0 | 2 | 55 |
| [src/tasks/generate_line/index.ts](/src/tasks/generate_line/index.ts) | TypeScript | 193 | 20 | 18 | 231 |
| [src/tasks/generate_line/pick_sentence_beginning.ts](/src/tasks/generate_line/pick_sentence_beginning.ts) | TypeScript | 25 | 1 | 2 | 28 |
| [src/tasks/log/index.ts](/src/tasks/log/index.ts) | TypeScript | 18 | 0 | 2 | 20 |
| [src/tasks/next/index.ts](/src/tasks/next/index.ts) | TypeScript | 18 | 0 | 2 | 20 |
| [src/tasks/retry/closeJob.ts](/src/tasks/retry/closeJob.ts) | TypeScript | 58 | 9 | 7 | 74 |
| [src/tasks/retry/index.ts](/src/tasks/retry/index.ts) | TypeScript | 35 | 0 | 2 | 37 |
| [src/tasks/scrape/convertToPlain.ts](/src/tasks/scrape/convertToPlain.ts) | TypeScript | 23 | 12 | 8 | 43 |
| [src/tasks/scrape/convertToPlain2.ts](/src/tasks/scrape/convertToPlain2.ts) | TypeScript | 0 | 57 | 11 | 68 |
| [src/tasks/scrape/convertToPlain3.ts](/src/tasks/scrape/convertToPlain3.ts) | TypeScript | 42 | 16 | 11 | 69 |
| [src/tasks/scrape/convertToPlain4.ts](/src/tasks/scrape/convertToPlain4.ts) | TypeScript | 66 | 26 | 17 | 109 |
| [src/tasks/scrape/index.ts](/src/tasks/scrape/index.ts) | TypeScript | 99 | 13 | 19 | 131 |
| [src/tasks/scrape/index_scraperapi.ts](/src/tasks/scrape/index_scraperapi.ts) | TypeScript | 57 | 14 | 6 | 77 |
| [src/tasks/scrape/isValid.ts](/src/tasks/scrape/isValid.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/tasks/scrape/transformUrl.ts](/src/tasks/scrape/transformUrl.ts) | TypeScript | 10 | 3 | 4 | 17 |
| [src/tasks/summarize/index.ts](/src/tasks/summarize/index.ts) | TypeScript | 76 | 20 | 8 | 104 |
| [src/utils/bee.ts](/src/utils/bee.ts) | TypeScript | 0 | 24 | 7 | 31 |
| [src/utils/bullmq.ts](/src/utils/bullmq.ts) | TypeScript | 11 | 3 | 4 | 18 |
| [src/utils/database.helpers.ts](/src/utils/database.helpers.ts) | TypeScript | 3 | 1 | 2 | 6 |
| [src/utils/database.types.ts](/src/utils/database.types.ts) | TypeScript | 497 | 0 | 2 | 499 |
| [src/utils/openai.ts](/src/utils/openai.ts) | TypeScript | 4 | 0 | 2 | 6 |
| [src/utils/supabase.ts](/src/utils/supabase.ts) | TypeScript | 15 | 5 | 6 | 26 |
| [src/worker.ts](/src/worker.ts) | TypeScript | 78 | 165 | 44 | 287 |
| [src/worker_finish_thread.ts](/src/worker_finish_thread.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/worker_generate_thread.ts](/src/worker_generate_thread.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/worker_retry_thread.ts](/src/worker_retry_thread.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/worker_scrape_thread.ts](/src/worker_scrape_thread.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/worker_summarize_thread.ts](/src/worker_summarize_thread.ts) | TypeScript | 5 | 0 | 2 | 7 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)