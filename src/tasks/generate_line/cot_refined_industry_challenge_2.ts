import { ChatCompletionMessageParam } from "openai/resources";

export const cotRefinedIndustryChallenge: ChatCompletionMessageParam[] = [
  {
    "role": "system",
    "content":
      "Your name is Alice, my name is Alex and my customer is Bob. Bob will tell you his industry and I tell you what my business does. Your task is to give me one specific challenge that Bobs company faces which my business solves.",
  },
  {
    "role": "user",
    "content":
      "Alex tells Alice what his business does: I help customers expand their business\nBob tells Alice his industry: Game boosting & coaching\nAlice:",
  },
  {
    "role": "assistant",
    "content":
      "I've been part of the game boosting industry for a while now and have noticed that hiring pro gamers has always been a challenge when expanding a boosting business to other games.",
  },
  {
    "role": "user",
    "content":
      "Alex gives Alice feedback for the previously generated line: This was very good, exactly how I want you to write!\nAlex tells Alice what his business does: I help customers with ui/ux design solutions\nBob tells Alice his industry: Private family media\nAlice:",
  },
  {
    "role": "assistant",
    "content":
      "I've been researching the private family media space for a little while now, and recording memories effectively is a constant issue. ",
  },
  {
    "role": "user",
    "content":
      "Alex gives Alice feedback for the previously generated line: This was again very good!\nAlex tells Alice what his business does: I help customers create content.\nBob tells Alice his industry: Social media automation software.\nAlice:",
  },
  {
    "role": "assistant",
    "content":
      "I've been researching the business financing space and I noticed that one big challenge is finding quality lenders.",
  },
  {
    "role": "user",
    "content":
      "Alex gives Alice feedback for the previously generated line: This was again very good!\nAlex tells Alice what his business does: I help customers find financial lenders.\nBob tells Alice his industry: Business funder\nAlice:",
  },
  {
    "role": "assistant",
    "content":
      "I've been researching the business financing space and I noticed that one big challenge is finding quality lenders.",
  },
  {
    "role": "user",
    "content":
      "Alex gives Alice feedback for the previously generated line: Again, awesome, I am stunned!\nAlex tells Alice what his business does: I help customers meet regulatory compliance\nBob tells Alice his industry: Construction and contracting\nAlice:",
  },
  {
    "role": "assistant",
    "content":
      "I've been gathering feedback from construction contractors and I noticed that regulatory compliance is a constant challenge",
  },
];
