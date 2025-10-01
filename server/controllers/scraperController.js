const { chromium } = require("playwright");
const { URL } = require("url");
const axios = require("axios");

const MAX_DEPTH = 3; // Reduced for faster testing, can be increased
const MAX_PAGES = 500; // Reduced for faster testing

// --- Core Scraper Function ---
async function processCrawlQueue(startUrl, page) {
  const baseUrl = new URL(startUrl).origin;
  const visitedUrls = new Set();
  const urlsToVisit = new Map(); // Using Map to store URL and its depth
  const scrapedResults = [];

  urlsToVisit.set(startUrl, 0);

  while (urlsToVisit.size > 0 && visitedUrls.size < MAX_PAGES) {
    // Get the first entry from the map
    const [currentUrl, depth] = urlsToVisit.entries().next().value;
    urlsToVisit.delete(currentUrl);

    if (visitedUrls.has(currentUrl) || depth > MAX_DEPTH) {
      continue;
    }
    visitedUrls.add(currentUrl);

    console.log(`[Depth ${depth}, Page ${visitedUrls.size}/${MAX_PAGES}] Scraping: ${currentUrl}`);

    try {
      await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      const pageData = await page.evaluate((bUrl) => {
        const title = document.title || "";
        const elements = document.querySelectorAll("h1, h2, h3, p, li, span");
        const content = Array.from(elements)
          .map((el) => el.innerText.trim())
          .filter((text) => text.length > 15 && text.length < 800) // Adjusted length filters
          .slice(0, 25); // Get a bit more content for better analysis

        const allLinks = Array.from(document.querySelectorAll("a[href]"))
          .map((a) => a.href)
          .filter((href) => {
            try {
              const linkUrl = new URL(href);
              // Ensure it's http/https, belongs to the same domain, and isn't just a fragment '#'
              return (
                linkUrl.protocol.startsWith("http") &&
                linkUrl.hostname === new URL(bUrl).hostname &&
                !href.endsWith("#")
              );
            } catch {
              return false;
            }
          });

        return { pageTitle: title, allContent: content, links: [...new Set(allLinks)] }; // Remove duplicate links
      }, baseUrl);

      const fullText = pageData.allContent.join(" ");
      const keywords = extractKeywords(fullText); // Keywords extracted locally as a fallback

      scrapedResults.push({
        url: currentUrl,
        depth,
        title: pageData.pageTitle,
        content: pageData.allContent.slice(0, 15), // Keep a reasonable amount of content
        foundLinks: pageData.links.length,
        keywords,
        contentLength: fullText.length,
        wordCount: fullText.split(/\s+/).filter(Boolean).length,
        timestamp: new Date().toISOString(),
      });

      if (depth < MAX_DEPTH) {
        for (const link of pageData.links) {
          if (!visitedUrls.has(link) && !urlsToVisit.has(link)) {
            urlsToVisit.set(link, depth + 1);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to scrape ${currentUrl}:`, error.message);
      scrapedResults.push({
        url: currentUrl,
        depth,
        error: `Scrape failed: ${error.message.substring(0, 100)}...`,
        keywords: [],
        contentLength: 0,
        wordCount: 0,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return { scrapedResults, totalScraped: visitedUrls.size };
}

// --- Keyword Extraction (Local Fallback) ---
function extractKeywords(text, maxKeywords = 10) {
  if (!text) return [];
  // Expanded stop words list
  const stopWords = new Set([
      "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
      "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
      "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
      "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
      "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
      "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
      "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
      "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
      "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
      "also", "get", "like", "use"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ") // Allow hyphens in words
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const wordFreq = {};
  words.forEach((word) => (wordFreq[word] = (wordFreq[word] || 0) + 1));

  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word, count]) => ({ word, count }));
}

// --- Send data to n8n and wait for response ---
async function sendToN8nAndWait(scrapedData) {
  const n8nWebhookUrl = "https://n8n.cybomb.com/webhook/optimize-crawl";
  try {
    const payload = {
      analysisType: "keyword_and_content_analysis",
      timestamp: new Date().toISOString(),
      totalPages: scrapedData.length,
      data: scrapedData,
    };

    console.log("Sending data to n8n...");
    const response = await axios.post(n8nWebhookUrl, payload, { timeout: 220000 }); // Increased timeout
    console.log("Raw n8n response received.");

    if (!response.data || !Array.isArray(response.data) || !response.data[0]?.output) {
      console.warn("n8n response is not in the expected format:", response.data);
      throw new Error("Invalid n8n response format.");
    }

    // Clean up potential markdown formatting from the AI response
    let jsonStr = response.data[0].output.trim();
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
    }

    const parsed = JSON.parse(jsonStr);
    console.log("Parsed n8n data:", JSON.stringify(parsed, null, 2));


    // More robustly normalizes keywords, handles strings or objects, and filters empty values.
    const normalizeKeywords = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr
            .map((k) => (typeof k === "object" && k !== null ? k.keyword || k.word : typeof k === 'string' ? k : null))
            .filter(Boolean);
    };
    
    // Safely access keyword_intent, providing a default empty object if it's missing.
    const intentData = parsed.keyword_intent || {};

    return {
      primary_keywords: normalizeKeywords(parsed.primary_keywords),
      secondary_keywords: normalizeKeywords(parsed.secondary_keywords),
      long_tail_keywords: normalizeKeywords(parsed.long_tail_keywords),
      related_keywords: normalizeKeywords(parsed.related_keywords),
      keyword_intent: {
        informational: normalizeKeywords(intentData.informational),
        navigational: normalizeKeywords(intentData.navigational),
        transactional: normalizeKeywords(intentData.transactional),
        commercial: normalizeKeywords(intentData.commercial),
      },
    };
  } catch (error) {
    console.error("Error processing n8n data:", error.message);
    // Fallback to locally extracted keywords if n8n fails
    const allKeywords = scrapedData.flatMap((r) => r.keywords.map((k) => k.word));
    return {
      primary_keywords: [...new Set(allKeywords)].slice(0, 10), // Use unique keywords
      secondary_keywords: [],
      long_tail_keywords: [],
      related_keywords: [],
      keyword_intent: { informational: [], navigational: [], transactional: [], commercial: [] },
      error: "Could not fetch detailed analysis from Provided URL. Displaying basic keywords.",
    };
  }
}

// --- Main Controller ---
exports.crawlAndScrape = async (req, res) => {
  let browser;
  try {
    const startUrl = req.body.url;
    if (!startUrl) {
      return res.status(400).json({ success: false, error: "Starting URL is required" });
    }
    try {
      new URL(startUrl);
    } catch {
      return res.status(400).json({ success: false, error: "Invalid URL format" });
    }

    console.log(`Starting crawl for: ${startUrl}`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        // Block images, stylesheets, and fonts to speed up scraping
        route: (route) => {
            const type = route.request().resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
                route.abort();
            } else {
                route.continue();
            }
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    const { scrapedResults, totalScraped } = await processCrawlQueue(startUrl, page);

    if (scrapedResults.length === 0) {
      return res.status(404).json({ success: false, error: "Could not find any content on the provided URL." });
    }

    const n8nData = await sendToN8nAndWait(scrapedResults);

    res.status(200).json({
      success: true,
      data: n8nData,
      mainUrl: startUrl,
      totalScraped: totalScraped,
      analysis: {
        sentToN8n: !n8nData.error,
        dataOptimized: !n8nData.error,
        fallback: !!n8nData.error,
      },
    });
  } catch (error) {
    console.error("Crawler failed:", error);
    res.status(500).json({ success: false, error: "An internal server error occurred during the crawl." });
  } finally {
    if (browser) await browser.close();
    console.log("Crawl process finished.");
  }
};
