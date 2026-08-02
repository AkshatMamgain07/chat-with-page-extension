// content.js
// This script runs INSIDE every webpage the user visits.
// Day 2: real content extraction using Mozilla's Readability.js
// (the same engine behind Firefox's Reader Mode).

console.log("[Chat with Page] Content script loaded on:", window.location.href);

/**
 * Readability mutates the DOM it's given, so we clone the document first
 * to avoid messing up the actual page the user is looking at.
 */
function extractPageText() {
  try {
    const documentClone = document.cloneNode(true);
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (article && article.content && article.content.trim().length > 100) {
      const spacedText = htmlToSpacedText(article.content);
      if (spacedText.length > 100) {
        return {
          title: article.title || document.title,
          text: spacedText,
          excerpt: article.excerpt || "",
          extractionMethod: "readability",
        };
      }
    }

    return fallbackExtraction();
  } catch (err) {
    console.warn("[Chat with Page] Readability failed, using fallback:", err);
    return fallbackExtraction();
  }
}

/**
 * Converts Readability's HTML output into plain text, inserting a newline
 * before AND after each block-level element so words from separate
 * paragraphs, headings, and table cells (like Wikipedia infoboxes)
 * don't get glued together (e.g. "CricketShaun" instead of "Cricket Shaun").
 */
function htmlToSpacedText(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const blockTags = new Set([
    "P", "DIV", "BR", "LI", "H1", "H2", "H3", "H4", "H5", "H6",
    "TR", "TD", "TH", "TABLE", "THEAD", "TBODY", "TFOOT",
    "BLOCKQUOTE", "SECTION", "ARTICLE", "UL", "OL",
    "FIGURE", "FIGCAPTION", "DT", "DD", "HEADER", "FOOTER",
  ]);

  let text = "";

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const isBlock = blockTags.has(node.tagName);
    if (isBlock) text += "\n";

    for (const child of node.childNodes) walk(child);

    if (isBlock) text += "\n";
  }

  walk(container);

  return text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}

/**
 * Rough fallback for pages Readability can't parse well
 * (e.g. GitHub file views, dashboards, short pages).
 */
function fallbackExtraction() {
  return {
    title: document.title,
    text: document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 20000),
    excerpt: "",
    extractionMethod: "fallback",
  };
}

// Listen for a message from the side panel asking for page content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_TEXT") {
    const result = extractPageText();
    console.log(
      `[Chat with Page] Extracted ${result.text.length} chars via ${result.extractionMethod}`
    );
    sendResponse({ ...result, url: window.location.href });
  }
  return true;
});