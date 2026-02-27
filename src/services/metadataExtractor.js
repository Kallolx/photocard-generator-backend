const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Extract metadata from a URL
 * @param {string} url - The URL to extract metadata from
 * @returns {Promise<Object>} Extracted metadata
 */
async function extractMetadata(url) {
  try {
    // Validate URL
    new URL(url);

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 15000, // 15 second timeout
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Helper to decode HTML entities
    const decodeHtml = (str) => {
      if (!str) return "";
      return cheerio.load(str).text();
    };

    // Extract title with priority
    let schemaTitle = "";
    try {
      $('script[type="application/ld+json"]').each((i, el) => {
        if (schemaTitle) return;
        try {
          const json = JSON.parse($(el).html() || "{}");
          const schemas = Array.isArray(json) ? json : json["@graph"] || [json];

          for (const item of schemas) {
            const type = Array.isArray(item["@type"])
              ? item["@type"]
              : [item["@type"]];
            if (
              type.some((t) =>
                ["Article", "NewsArticle", "BlogPosting", "Report"].includes(t),
              )
            ) {
              if (item.headline) {
                schemaTitle = item.headline;
              } else if (item.name) {
                schemaTitle = item.name;
              }
            }
          }
        } catch (e) {}
      });
    } catch (e) {}

    let title =
      decodeHtml(schemaTitle) ||
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text();

    if (title) {
      if (title.includes("&")) {
        title = decodeHtml(title);
      }
      title = title.trim();
      title = title.replace(/^Prominent Bengali News portal/i, "").trim();

      // Remove common separators
      const separators = [" | ", " || ", " - ", " :: ", " / "];
      for (const sep of separators) {
        if (title.includes(sep)) {
          const parts = title.split(sep);
          title = parts.reduce((a, b) => (a.length >= b.length ? a : b)).trim();
          break;
        }
      }
    }

    title = title || "No title found";

    // Extract main image
    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("img").first().attr("src");

    if (image) image = image.trim();
    if (image && !image.startsWith("http")) {
      const baseUrl = new URL(url);
      if (image.startsWith("//")) {
        image = baseUrl.protocol + image;
      } else if (image.startsWith("/")) {
        image = baseUrl.origin + image;
      } else {
        image = baseUrl.origin + "/" + image;
      }
    }

    // Extract logo
    let logo =
      $('img[alt*="logo" i]').first().attr("src") ||
      $('img[class*="logo" i]').first().attr("src") ||
      $('img[id*="logo" i]').first().attr("src") ||
      $(".logo img").first().attr("src") ||
      $("#logo img").first().attr("src") ||
      $("header img").first().attr("src") ||
      $(".header img").first().attr("src");

    if (logo) logo = logo.trim();
    if (logo && !logo.startsWith("http")) {
      const baseUrl = new URL(url);
      if (logo.startsWith("//")) {
        logo = baseUrl.protocol + logo;
      } else if (logo.startsWith("/")) {
        logo = baseUrl.origin + logo;
      } else {
        logo = baseUrl.origin + "/" + logo;
      }
    }

    // Extract favicon
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      "/favicon.ico";

    if (favicon) favicon = favicon.trim();
    if (favicon && !favicon.startsWith("http")) {
      const baseUrl = new URL(url);
      if (favicon.startsWith("//")) {
        favicon = baseUrl.protocol + favicon;
      } else if (favicon.startsWith("/")) {
        favicon = baseUrl.origin + favicon;
      } else {
        favicon = baseUrl.origin + "/" + favicon;
      }
    }

    // Extract site name
    let siteName =
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="application-name"]').attr("content") ||
      new URL(url).hostname.replace("www.", "");

    console.log("Extracted metadata:", {
      title,
      image,
      logo: logo || favicon,
      favicon,
      siteName,
    });

    return {
      title,
      image,
      logo: logo || favicon,
      favicon,
      siteName,
      url,
    };
  } catch (error) {
    console.error("Metadata extraction error:", error.message);
    throw new Error(`Failed to extract metadata: ${error.message}`);
  }
}

module.exports = { extractMetadata };