import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../../utils/openai";

export async function gptGetIndustry(content: string) {
  const sysPrompt = `
    You will be provided with an company bio. Your task is to tell me the industry of the company. Use 2-5 words.\n`;
  const prompt = `
    Company Bio: Guardian Boost is a professional gaming service that specializes in helping players achieve their goals in the popular video game Destiny 2. They offer a wide range of boosting services, including guaranteed exotic item acquisition, completion of difficult raid challenges, and flawless runs in the competitive Trials of Osiris game mode. With a team of experienced boosters, Guardian Boost strives to provide fast and efficient service, starting most orders within an hour of purchase. They also prioritize customer satisfaction, offering a 7-day money-back guarantee and aiming to complete orders within 16-24 hours. Their boosters use VPN protection to ensure the safety and privacy of their clients' accounts. If customers have any questions or need assistance, they can reach out to Guardian Boost's live chat support.\n
    You: game boosting & coaching\n
    Company Bio: Lalo aims to provide a safe and secure space for users to preserve their memories and connect with loved ones, while giving them full control over their privacy and content.\n
    You: private family media\n
    Company Bio: Fulkerson Winery is a family-owned business with a rich history spanning seven generations of family farming. They offer a variety of products and services, including seated tastings, sales, U-Pick crops, and supplies for beer and winemaking. They are known for their fresh, unpasteurized, 100% whole grape juice, which is perfect for home winemaking. Fulkerson Winery has been recognized as the New York Sauvignon Blanc Winery of the Year for 2021, a testament to their commitment to quality and excellence. Customers can sign up for their newsletter to stay updated on the latest news and events from the winery.\n
    You: Online Wine and Spirits\n
    Company Bio: Forrest seems to be a promising tool for businesses seeking automated social media content to boost their online presence and engagement.\n
    You: social media automation software\n
    Company Bio: Based on the scraped website, the company is called AnimoX Animo and they specialize in helping businesses grow their brand through various marketing strategies. They pride themselves on being the tools for their clients, who are the artists, and emphasize the importance of content in storytelling. Their services include graphic design, video marketing, social media marketing, branding and design, and web design development. They also offer a free consultation and audit of clients' marketing efforts to ensure they are effective and not wasting money. The website showcases testimonials from satisfied clients and highlights their successful projects, such as running ads for DSR and growing the YouTube personality Javi Enrique. Overall, AnimoX Animo presents itself as a reliable and innovative marketing agency that can help businesses achieve success.\n
    You: graphic design service\n
    Company Bio: ${content}\n
    You:`;
  const messages: ChatCompletionMessageParam[] = [
    {
      "role": "system",
      "content": sysPrompt,
    },
    {
      "role": "user",
      "content": prompt,
    },
  ];
  const chat = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo-1106",
    stream: false,
    temperature: 0.8,
    max_tokens: 64,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: -2,
  });

  const meta = {
    model: chat.model,
    prompt_tokens: chat.usage?.prompt_tokens,
    completion_tokens: chat.usage?.completion_tokens,
    total_tokens: chat.usage?.total_tokens,
  };

  return {
    data: chat.choices[0].message.content ??
      "Service industry",
    meta: meta,
  };
}
