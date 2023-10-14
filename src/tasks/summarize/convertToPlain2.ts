import { DOMParser, Node } from "dom-parser";

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

export function convertToPlain(html: string) {
  // Parse the HTML string into a DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("Could not parse HTML");
  }

  // Find the container element (e.g., <div>) to start the extraction
  const container = doc.querySelector("body");

  if (!container) {
    throw new Error("Could not parse HTML");
  }
  // Extract raw text content from the container element and its children
  const rawTextContent = extractRawText(container);

  // const cleanedText = rawTextContent.replace(/\s+/g, " ");
  // The regular expression [\n\r\t]+ matches one or more line breaks
  // (including newline \n and carriage return \r) and tabs \t, and replaces them with a single space.
  // Afterward, the regular expression /\s+/g is used to replace multiple consecutive
  // spaces with a single space. This should give you a cleaned text with
  // line breaks removed and spaces between words preserved.
  const cleanedText = rawTextContent.replace(/[\n\r\t]+/g, " ").replace(
    /\s+/g,
    " ",
  );

  const trimmedText = cleanedText.trim();
  return trimmedText;
}
