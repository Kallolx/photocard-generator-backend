const puppeteer = require("puppeteer");
const { query, getConnection } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { extractMetadata } = require("../services/metadataExtractor");

const generateCard = async (req, res) => {
  const { url, theme = "classic", bgColor = "#dc2626" } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL is required" });
  }

  let browser;
  try {
    console.log("[API] Extracting metadata from URL:", url);

    // Extract metadata from URL
    const metadata = await extractMetadata(url);
    console.log("[API] Metadata extracted:", {
      title: metadata.title?.substring(0, 50),
      hasImage: !!metadata.image,
      hasLogo: !!metadata.logo,
      siteName: metadata.siteName
    });

    // Launch headless browser with production-ready args
    console.log("[API] Launching Puppeteer browser...");
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-web-security",
      ],
      timeout: 60000,
    });
    console.log("[API] Browser launched successfully");

    const page = await browser.newPage();

    // Construct internal render URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Proxy images through frontend to avoid CORS issues
    const proxyImage = (imgUrl) => {
      if (!imgUrl || imgUrl.startsWith('data:')) return imgUrl;
      return `${frontendUrl}/api/image-proxy?url=${encodeURIComponent(imgUrl)}`;
    };

    // Build query parameters with extracted metadata
    const params = new URLSearchParams({
      url: metadata.url,
      theme: theme,
      title: metadata.title,
      image: proxyImage(metadata.image),
      logo: proxyImage(metadata.logo),
      favicon: proxyImage(metadata.favicon),
      siteName: metadata.siteName,
      bgType: "solid",
      bgColor: bgColor,
      frameColor: bgColor,
      frameThickness: "0",
    });

    const renderUrl = `${frontendUrl}/render/card?${params.toString()}`;
    console.log(`[API] Rendering: ${renderUrl}`);

    // Set viewport to a reasonable size
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

    console.log("[API] Navigating to render URL...");
    await page.goto(renderUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    console.log("[API] Navigation complete");

    // Wait for the card element to be present
    const selector = "#card-container";
    console.log("[API] Waiting for card element...");
    await page.waitForSelector(selector, { timeout: 30000 });
    console.log("[API] Card element found");

    const element = await page.$(selector);

    if (!element) {
      throw new Error("Card element not found");
    }

    // Capture screenshot
    console.log("[API] Taking screenshot...");
    const imageBuffer = await element.screenshot({ type: "png" });
    console.log("[API] Screenshot captured, size:", imageBuffer.length, "bytes");

    await browser.close();

    // Increment Usage Count
let connection;
try {
  if (req.user && req.user.email === 'khksnkallol@gmail.com') {
    console.log("Admin user detected: Skipping usage increment.");
  } else {
    connection = await getConnection();
    await connection.query(
      "UPDATE api_keys SET daily_usage = daily_usage + 1 WHERE id = ?",
      [req.apiKeyId],
    );
  }
} catch (dbErr) {
  console.error("Failed to increment usage stats:", dbErr);
} finally {
  if (connection) connection.release();
}

    // Send response
    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("[API] Card Generation Error:", error.message);
    console.error("[API] Error stack:", error.stack);
    if (browser) await browser.close();
    res.status(500).json({
      success: false,
      message: "Failed to generate card",
      error: error.message,
    });
  }
};

const generateApiKey = async (req, res) => {
  const userId = req.user.id;
  const newKey = `pk_live_${uuidv4().replace(/-/g, "")}`;

  let connection;
  try {
    connection = await getConnection();

    // 1. Revoke existing keys
    await connection.query("UPDATE api_keys SET status = 'revoked' WHERE user_id = ?", [userId]);

    // 2. Insert new key
    await connection.query(
      "INSERT INTO api_keys (user_id, api_key, status) VALUES (?, ?, ?)",
      [userId, newKey, "active"]
    );

    res.json({ success: true, apiKey: newKey });
  } catch (error) {
    console.error("Key Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate API key" });
  } finally {
    if (connection) connection.release();
  }
};

const getApiKey = async (req, res) => {
  const userId = req.user.id;
  let connection;
  try {
    connection = await getConnection();
    // FIXED: Corrected quotes and removed the trailing '>'
    const [rows] = await connection.query(
      "SELECT api_key, created_at, daily_usage, last_reset_date FROM api_keys WHERE user_id = ? AND status = 'active' LIMIT 1",
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.json({ success: true, apiKey: null });
    }

    const today = new Date().toISOString().slice(0, 10);
    let usage = rows[0].daily_usage || 0;
    const lastReset = rows[0].last_reset_date
      ? new Date(rows[0].last_reset_date).toISOString().slice(0, 10)
      : null;

    if (lastReset !== today) {
      usage = 0;
    }

    res.json({
      success: true,
      apiKey: rows[0].api_key,
      createdAt: rows[0].created_at,
      usage: usage,
      limit: req.user.email === 'khksnkallol@gmail.com' ? 1000000 : 20,
    });
  } catch (error) {
    console.error("Get Key Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve API key" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  generateCard,
  generateApiKey,
  getApiKey,
};