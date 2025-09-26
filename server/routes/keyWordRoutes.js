const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const keyword_extractor = require("keyword-extractor");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Fetch website HTML
    const response = await fetch(url);
    const html = await response.text();

    // Load with cheerio
    const $ = cheerio.load(html);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";
    const bodyText = $("body").text();

    const fullText = `${title} ${description} ${bodyText}`;

    // Extract keywords
    const keywordsArray = keyword_extractor.extract(fullText, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false, // keep duplicates to calculate counts
    });

    // Count occurrences
    const keywordCounts = {};
    keywordsArray.forEach((word) => {
      keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });

    const totalWords = keywordsArray.length;

    // Convert to array of objects with density
    const keywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: ((count / totalWords) * 100).toFixed(2),
      }))
      .sort((a, b) => b.count - a.count) // sort by frequency
      .slice(0, 20); // top 20

    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
