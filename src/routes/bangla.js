const express = require("express");
const router = express.Router();
const banglaController = require("../controllers/banglaController");

/**
 * @route   POST /api/bangla/convert
 * @desc    Convert text between Bijoy and Unicode Bangla encodings
 * @access  Public
 */
router.post("/convert", banglaController.convertText);

module.exports = router;
