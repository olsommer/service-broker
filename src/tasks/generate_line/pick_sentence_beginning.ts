export const pickSentenceBeginning = (focus: string) => {
  let i;

  const beginningsForChallenge = [
    "I've been part",
    "I've observed",
    "In my ongoing research",
    "It's evident that",
    "I've noticed that",
    "While closely tracking",
    "In my research",
    "In my recent research",
    "As I've dived into",
    "As I've delved into",
    "In my interactions",
    "I've closely observed",
    "It's quite clear that",
    "I've taken note that",
    "As I've delved deeper into",
    "I've closely examined",
    "I've discerned that",
    "While tracking",
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

  switch (focus) {
    case "Trends and challenges of industry":
      i = beginningsForChallenge;
      break;
    case "Compliments about company":
      i = beginningsForCompliments;
      break;
    case "Looking for their service mock":
      i = beginningsForLookingForService;
      break;
    default:
      i = beginningsForCompliments;
      break;
  }

  const index = crypto.getRandomValues(new Uint32Array(1))[0] %
    i.length;

  return i[index];
};
