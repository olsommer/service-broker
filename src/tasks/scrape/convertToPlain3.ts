import { DOMParser } from "@xmldom/xmldom";
import { log } from "../log";

// Function to extract raw text content recursively
function extractRawText(node: Node): string {
  let result = "";

  // If the node is a text node, concatenate its text
  if (node.nodeType === Node.TEXT_NODE) {
    result += node.textContent || "";
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const nodeName = node.nodeName.toLowerCase();

    // Exclude script and style elements and their content
    if (
      nodeName === "script" || nodeName === "style" || nodeName === "nav" ||
      nodeName === "a"
    ) {
      return result;
    }
    // If the node is an element node, recursively extract text from its child nodes
    for (const childNode of node.childNodes) {
      result = " " + result + " " + extractRawText(childNode) + " ";
    }
  }

  return result;
}

export async function convertToPlain(html: string) {
  // Parse the HTML string into a DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  await log("OK", String(doc), "2d64c8d0-5f66-4729-b076-c2d68c176981", "1");

  if (!doc) {
    throw new Error("Could not parse HTML");
  }

  // Find the container element (e.g., <div>) to start the extraction
  const container = doc.getElementsByTagName("body")[0];

  await log(
    "OK",
    String(container),
    "2d64c8d0-5f66-4729-b076-c2d68c176981",
    "2",
  );

  if (!container) {
    throw new Error("Could not parse HTML");
  }
  // Extract raw text content from the container element and its children
  const rawTextContent = extractRawText(container);

  await log(
    "OK",
    String(rawTextContent),
    "2d64c8d0-5f66-4729-b076-c2d68c176981",
    "3",
  );

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
  return trimmedText;
}
