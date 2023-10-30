export const pickSentenceBeginning = () => {
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
    "In my persuit",
    "As I've immersed myself",
  ];

  const index = crypto.getRandomValues(new Uint32Array(1))[0] %
    beginningsForChallenge.length;
  // const index = Math.floor(Math.random() * beginningsForChallenge.length);
  return beginningsForChallenge[index];
};
