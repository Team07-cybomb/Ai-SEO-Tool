const { chromium } = require("playwright");
const { URL } = require("url");

// Define maximum limits for safety
const MAX_DEPTH = 3;   // Maximum linking depth (Start -> Link 1 -> Link 2 -> Link 3)
const MAX_PAGES = 500; // Maximum total pages to scrape

// --- Core Scraper Function ---
async function processCrawlQueue(startUrl, page) {
  const baseUrl = new URL(startUrl).origin;
  const visitedUrls = new Set();
  const urlsToVisit = new Map(); // Stores URL and its depth: { url: depth }
  const scrapedResults = [];

  // Initialize the queue with the starting URL
  urlsToVisit.set(startUrl, 0);

  while (urlsToVisit.size > 0 && visitedUrls.size < MAX_PAGES) {
    // Get the next URL and its depth from the top of the map
    const [currentUrl, depth] = [...urlsToVisit.entries()][0];
    urlsToVisit.delete(currentUrl);

    // Skip if already visited or max pages reached
    if (visitedUrls.has(currentUrl) || depth > MAX_DEPTH) {
      continue;
    }

    visitedUrls.add(currentUrl);

    console.log(`[Depth ${depth}, Page ${visitedUrls.size}] Scraping: ${currentUrl}`);

    try {
      await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      const { pageTitle, allContent, links } = await page.evaluate((bUrl) => {
        const title = document.title;

        // Comprehensive content scraping (Headings, Paragraphs, List Items, etc.)
        const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li");
        const content = Array.from(elements)
          .map((el) => el.innerText.trim())
          .filter((text) => text.length > 0);

        // Find and filter sub-links
        const allLinks = Array.from(document.querySelectorAll("a"))
          .map((a) => a.href)
          .filter((href) => {
            try {
              const linkUrl = new URL(href);
              const pageDomain = new URL(bUrl).hostname;

              // Only allow internal links (same domain)
              return linkUrl.hostname === pageDomain && href.startsWith("http");
            } catch (e) {
              return false;
            }
          });

        return { pageTitle: title, allContent: content, links: allLinks };
      }, baseUrl);

      scrapedResults.push({
        url: currentUrl,
        depth,
        title: pageTitle,
        content: allContent,
        foundLinks: links.length,
      });

      // Add newly found links to the queue for next iteration
      if (depth < MAX_DEPTH) {
        for (const link of links) {
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
        error: `Scrape failed: ${error.message.substring(0, 50)}...`,
      });
    }
  }

  return { scrapedResults, totalScraped: visitedUrls.size };
}

// --- Primary API entry point ---
exports.crawlAndScrape = async (req, res) => {
  let browser;
  try {
    const startUrl = req.body.url;
    if (!startUrl) {
      return res.status(400).json({ error: "Starting URL is required" });
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // The core crawling logic runs here
    const { scrapedResults, totalScraped } = await processCrawlQueue(startUrl, page);

    res.status(200).json({
      success: true,
      data: scrapedResults,
      mainUrl: startUrl,
      totalScraped: totalScraped,
    });
  } catch (error) {
    console.error("Crawler failed:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during crawl",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
