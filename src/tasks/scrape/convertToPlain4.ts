import { log } from "../log";
import { AnyNode, Cheerio, load } from "cheerio";
import { DOMParser } from "@xmldom/xmldom";

export async function convertToPlain(html: string) {
  let $ = load(html);

  let rawTextContent = $("html *").contents().map(function () {
    return (this.type === "text") ? $(this).text() + " " : "";
  }).get().join("");

  // const $$ = $("main").length ? $("main") : $("body");
  // $$.find(
  //   "script, style, nav, button, a, img, svg, video, audio, iframe, table, footer",
  // ).remove();
  // // core = core.find("p, h1, h2, h3, h4, h5, h6, li, span, div, a, b, i, u, s");

  // // Extract raw text content from the container element and its children
  // let rawTextContent = $$.text();

  // const htmlTags =
  //   /<script|<style|<nav|<button|<a|<img|<svg|<video|<audio|<iframe|<table|<footer/g;
  // const hasTags = htmlTags.test(rawTextContent);

  // if (hasTags) {
  //   rawTextContent = await convertToPlainBackup(html);
  // }

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

  const trimmedText = rawTextContent.trim();
  return trimmedText;
}

// Convert again if the first conversion fails
const convertToPlainBackup = async (html: string) => {
  // Parse the HTML string into a DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("Could not parse HTML because no document found");
  }

  // Find the container element (e.g., <div>) to start the extraction
  // const container = doc.getElementsByTagName("body")[0];

  // if (!container) {
  //   throw new Error(
  //     "Could not parse HTML because body container was not found",
  //   );
  // }
  // Extract raw text content from the container element and its children
  const rawTextContent = extractRawText(doc);
  return rawTextContent;
};

// Convert again if the first conversion fails
const extractRawText = (node: Node) => {
  let result = "";

  // If the node is a text node, concatenate its text
  if (node.nodeType === 3) { // 3 corresponds to TEXT_NODE
    result += node.nodeValue || "";
  } else if (node.nodeType === 1) { // 1 corresponds to ELEMENT_NODE
    const nodeName = node.nodeName.toLowerCase();
    const excludedElements = [
      "script",
      "style",
      "nav",
      "button",
      "a",
      "img",
      "svg",
      "audio",
      "iframe",
      "table",
      "footer",
      "head",
    ];

    // Exclude script and style elements and their content
    // "script, style, nav, button, a, img, svg, video, audio, iframe, table, footer",
    if (excludedElements.includes(nodeName)) {
      return result;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      result += " " + extractRawText(node.childNodes[i]) + " ";
    }
  }

  return result;
};
