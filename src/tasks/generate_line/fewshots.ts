import { ChatCompletionMessageParam } from "openai/resources";
import { fewShotsCompliments } from "./fewshots_init_compliments_about_company";
import { fewShotsLookingForService } from "./fewshots_init_looking_for_service_mock";
import { fewShotsIndustryChallenge } from "./fewshots_init_trends_and_challenges_of_industry";

export type FewShots = { [key in Focus]: ChatCompletionMessageParam[] };

export const fewShots: FewShots = {
    "Trends and challenges of industry": fewShotsIndustryChallenge,
    "Looking for their service mock": fewShotsLookingForService,
    "Compliments about company": fewShotsCompliments
};