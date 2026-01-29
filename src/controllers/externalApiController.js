const puppeteer = require("puppeteer");
const { getConnection } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const generateCard = async (req, res) => {
  const { url, theme = "classic", options = {} } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL is required" });
  }

  let browser;
  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Construct internal render URL
    // Point to the Next.js frontend running locally
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Build query parameters
    const params = new URLSearchParams({
      url: url,
      theme: theme,
      ...options,
    });

    const renderUrl = `${frontendUrl}/render/card?${params.toString()}`;
    console.log(`Rendering: ${renderUrl}`);

    // Set viewport to a reasonable size
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

    await page.goto(renderUrl, { waitUntil: "networkidle0" });

    // Wait for the card element to be present
    const selector = "#card-container";
    await page.waitForSelector(selector);

    const element = await page.$(selector);

    if (!element) {
      throw new Error("Card element not found");
    }

    // Capture screenshot
    const imageBuffer = await element.screenshot({ type: "png" });

    await browser.close();

    // Increment Usage Count
    let connection;
    try {
      connection = await getConnection();
      await connection.query(
        "UPDATE api_keys SET daily_usage = daily_usage + 1 WHERE id = ?",
        [req.apiKeyId],
      );
    } catch (dbErr) {
      console.error("Failed to increment usage stats:", dbErr);
      // Don't fail the request if just stats update fails
    } finally {
      if (connection) connection.release();
    }

    // Send response
    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Puppeteer/Generation Error:", error);
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

    // Revoke existing keys? Or allow multiple? For now, let's allow one active key per user, revoke others.
    await connection.query(
      'UPDATE api_keys SET status = "revoked" WHERE user_id = ?',
      [userId],
    );

    await connection.query(
      'INSERT INTO api_keys (user_id, api_key, status) VALUES (?, ?, "active")',
      [userId, newKey],
    );

    res.json({ success: true, apiKey: newKey });
  } catch (error) {
    console.error("Key Generation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate API key" });
  } finally {
    if (connection) connection.release();
  }
};

const getApiKey = async (req, res) => {
  const userId = req.user.id;
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      'SELECT api_key, created_at, daily_usage, last_reset_date FROM api_keys WHERE user_id = ? AND status = "active" LIMIT 1',
      [userId],
    );

    if (rows.length === 0) {
      return res.json({ success: true, apiKey: null });
    }

    // Calculate effective usage (reset if old date)
    const today = new Date().toISOString().slice(0, 10);
    let usage = rows[0].daily_usage;
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
      limit: 20,
    });
  } catch (error) {
    console.error("Get Key Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve API key" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  generateCard,
  generateApiKey,
  getApiKey,
};
