const { getConnection } = require("../config/database");

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Missing API key. Please provide x-api-key header.",
    });
  }

  let connection;
  try {
    connection = await getConnection();

    // 1. Check if key exists and is active
    const [keys] = await connection.query(
      "SELECT k.*, u.plan, u.status as user_status FROM api_keys k JOIN users u ON k.user_id = u.id WHERE k.api_key = ?",
      [apiKey],
    );

    if (keys.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key.",
      });
    }

    const keyData = keys[0];

    // 2. Check key status
    if (keyData.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "API key is revoked.",
      });
    }

    // 3. Check user status
    if (keyData.user_status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is not active.",
      });
    }

    // 4. Check Plan (Premium Only)
    if (keyData.plan !== "Premium") {
      return res.status(403).json({
        success: false,
        message: "API access requires a Premium plan.",
      });
    }

    // 5. Rate Limiting Logic (Max 20/day)
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let usage = keyData.daily_usage;

    // Check if we need to reset usage for a new day
    const lastReset = keyData.last_reset_date
      ? new Date(keyData.last_reset_date).toISOString().slice(0, 10)
      : null;

    if (lastReset !== today) {
      // Reset usage in DB
      await connection.query(
        "UPDATE api_keys SET daily_usage = 0, last_reset_date = ? WHERE id = ?",
        [today, keyData.id],
      );
      usage = 0;
    }

    if (usage >= 20) {
      return res.status(429).json({
        success: false,
        message:
          "Daily API limit exceeded (20 req/day). Upgrade feature coming soon.",
      });
    }

    // Attach user and key info to request
    req.user = {
      id: keyData.user_id,
      plan: keyData.plan,
    };
    req.apiKeyId = keyData.id;

    next();
  } catch (error) {
    console.error("API Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal authentication error.",
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = apiKeyAuth;
