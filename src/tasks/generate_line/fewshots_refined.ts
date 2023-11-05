import { fewShotsComplimentsAboutCompany } from "./fewshots_refined_compliments_about_company";
import { fewShotsLookingForServiceMock } from "./fewshots_refined_looking_for_service_mock";
import { fewShotsTrendsAndChallengesOfIndustry } from "./fewshots_refined_trends_and_challenges_of_industry";

export type FewShotsBeginnings = {[key:string]: {[key:number]: {bad: string, good: string}}};
export type FewShotsRefined = { [key in Focus]: FewShotsBeginnings };

export const fewShots: FewShotsRefined = {
    "Trends and challenges of industry": fewShotsTrendsAndChallengesOfIndustry,
    "Looking for their service mock": fewShotsLookingForServiceMock,
    "Compliments about company": fewShotsComplimentsAboutCompany
};