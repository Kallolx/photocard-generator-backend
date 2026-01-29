const express = require("express");
const router = express.Router();
const externalApiController = require("../controllers/externalApiController");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const { authenticate } = require("../middleware/auth");

// Public Facing API (Protected by API Key)
// Endpoint: /api/external/v1/generate
router.post("/v1/generate", apiKeyAuth, externalApiController.generateCard);

// Management Endpoints (Protected by User Token - used by Frontend Settings)
// Endpoint: /api/external/keys/generate
router.post("/keys", authenticate, externalApiController.generateApiKey);

// Endpoint: /api/external/keys
router.get("/keys", authenticate, externalApiController.getApiKey);

module.exports = router;
