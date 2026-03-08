const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const result = require("dotenv").config({
  path: "/home/azureuser/photocard-generator-backend/.env",
});

if (result.error) {
  console.log("❌ COULD NOT LOAD .ENV FILE:", result.error);
} else {
  console.log("✅ .env file loaded successfully from absolute path");
  console.log(
    "✅ JWT_SECRET status:",
    process.env.JWT_SECRET ? "DEFINED" : "UNDEFINED",
  );
}

const { testConnection } = require("./config/database");

// Create Express app
const app = express();

// Enable trust proxy for cPanel/LiteSpeed
app.set("trust proxy", 1);

// CORS configuration - MUST be before other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Allow all origins in development/production
      // You can restrict this to specific domains if needed
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    exposedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  }),
);

// Handle preflight requests
app.options("*", cors());

// Security middleware - after CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/cards", require("./routes/cards"));
app.use("/api/external", require("./routes/externalApiRoutes"));
app.use("/api/bangla", require("./routes/bangla"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Newscard API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler Triggered:");
  console.error("Query:", req.query);
  console.error("Body:", req.body);
  console.error("Error Message:", err.message);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        "Failed to connect to database. Please check your configuration.",
      );
      process.exit(1);
    }

    // Only listen if the file is run directly (not required by lsnode)
    // OR if we are sure lsnode isn't handling it.
    // However, the error 'listen was called more than once' suggests conflict.
    // We'll trust the process.env.PORT and ensure we don't listen if the socket is being managed?
    // Actually, usually simply exporting app is enough for some setups, but let's just clean this up.

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`\nAPI Endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/profile`);
      console.log(`   POST   /api/auth/logout`);
      console.log(`   POST   /api/user/upgrade-plan`);
      console.log(`   GET    /api/user/credits`);
      console.log(`   GET    /api/user/features/:feature`);
      console.log(`   POST   /api/cards/generate`);
      console.log(`   GET    /api/cards/check-limit\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only run startServer if not imported OR if we need to force it.
// The error 'listen called more than once' strongly implies lsnode requires the file AND tries to listen.
if (require.main === module) {
  startServer();
} else {
  // If required by lsnode, we might still need to connect to DB?
  // But we shouldn't call app.listen() if lsnode does it.
  // Let's at least connect to DB.
  testConnection()
    .then(() => {
      console.log("DB Connected via loader");
    })
    .catch((err) => console.error("DB Connection Failed:", err));
}

module.exports = app;
