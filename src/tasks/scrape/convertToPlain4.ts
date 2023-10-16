import { log } from "../log";
import { AnyNode, Cheerio, load } from "cheerio";

export async function convertToPlain(html: string) {
  const $ = load(html);
  let core: Cheerio<AnyNode>;

  /* Check if there is a main */
  if ($("body").has("main").length > 0) {
    core = $("body");
  } else {
    core = $("main");
  }

  // core = core.find("p, h1, h2, h3, h4, h5, h6, li, span, div, a, b, i, u, s");
  // core = core.find("p, h1, h2, h3, h4, h5, h6, li, span, div, a, b, i, u, s");
  core = core.filter("script").filter("style").filter("nav").filter("a").filter(
    "img",
  ).filter("svg").filter("video").filter("audio").filter("iframe");
  // style, nav, a, img, svg, video, audio, iframe;

  // Extract raw text content from the container element and its children
  const rawTextContent = core.text();
  await log(
    "OK",
    rawTextContent,
    "35b9c23b-6d90-4359-ac2b-662d0efc6186",
    "scrape",
  );

  // const cleanedText = rawTextContent.replace(/\s+/g, " ");
  // The regular expression [\n\r\t]+ matches one or more line breaks
  // (including newline \n and carriage return \r) and tabs \t, and replaces them with a single space.
  // Afterward, the regular expression /\s+/g is used to replace multiple consecutive
  // spaces with a single space. This should give you a cleaned text with
  // line breaks removed and spaces between words preserved.
  const cleanedText = rawTextContent
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/"/g, " ") // Escape double quotes
    .replace(/{/g, " ") // Escape curly braces {
    .replace(/}/g, " ") // Escape curly braces }
    .replace(/\\/g, " ") // Escape backslashes
    .replace(/[\x00-\x1F]/g, " ");

  const trimmedText = cleanedText.trim();
  return trimmedText;
}
