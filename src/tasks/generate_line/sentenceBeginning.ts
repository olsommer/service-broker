
const beginningsForChallenge = [
  "I've observed",
  "In my ongoing research",
  "It's evident that",
  "I've noticed that",
  "While closely tracking",
  "In my research",
  "In my recent research",
  "As I've dived into",
  "I've closely observed",
  "It's quite clear that",
  "I've taken note that",
];

const beginningsForCompliments = [
  "I really like",
  "I was impressed",
  "I'm truly impressed",
  "I genuinely appreciate",
  "I'm really fond",
  "I really value",
  "I truly like",
  "I greatly appreciate",
  "I'm extremely fond",
  "I'm genuinely pleased",
  "It's great to see",
];

const beginningsForLookingForService = [
  "I was looking for",
  "I was searching for",
  "I was on the hunt for",
  "I discovered",
  "I was seeking",
  "I stumbled upon",
  "I came across",
  "I found",
  "I spotted",
];

export type SentenceBeginning = typeof sentenceBeginning;

export const sentenceBeginning = {
  "Trends and challenges of industry": beginningsForChallenge,
  "Compliments about company": beginningsForCompliments,
  "Looking for their service mock": beginningsForLookingForService,
}
