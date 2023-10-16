import { parse } from "node-html-parser";

export function convertToPlain(html: string) {
  // Parse the HTML string into a DOM document
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(html, "text/html");
  const root = parse(html);

  if (!(root instanceof HTMLElement)) {
    throw new Error("Could not parse HTML");
  }

  // Find the container element (e.g., <div>) to start the extraction
  // const container = root.getElementsByTagName("body")[0];
  const container = root;

  if (!container) {
    throw new Error("Could not parse HTML");
  }
  // Extract raw text content from the container element and its children
  const rawTextContent = container.text;

  // const cleanedText = rawTextContent.replace(/\s+/g, " ");
  // The regular expression [\n\r\t]+ matches one or more line breaks
  // (including newline \n and carriage return \r) and tabs \t, and replaces them with a single space.
  // Afterward, the regular expression /\s+/g is used to replace multiple consecutive
  // spaces with a single space. This should give you a cleaned text with
  // line breaks removed and spaces between words preserved.
  const cleanedText = rawTextContent.replace(/[\n\r\t]+/g, " ").replace(
    /\s+/g,
    " ",
  ).replace(/"/g, " ") // Escape double quotes
    .replace(/{/g, " ") // Escape curly braces {
    .replace(/}/g, " ") // Escape curly braces }
    .replace(/\\/g, " ") // Escape backslashes
    .replace(/[\x00-\x1F]/g, " ");

  const trimmedText = cleanedText.trim();

  console.log(trimmedText);
  return trimmedText;
}
