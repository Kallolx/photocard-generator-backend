const { bijoyToUnicode, unicodeToBijoy } = require('@abdalgolabs/ansi-unicode-converter');
const { body, validationResult } = require("express-validator");

/**
 * @route   POST /api/bangla/convert
 * @desc    Convert text between Bangla encodings
 * @access  Public
 */
const convertText = [
  // Validation
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 10000 })
    .withMessage("Text must not exceed 10000 characters"),
  body("mode")
    .isIn(['bijoy-to-unicode', 'unicode-to-bijoy'])
    .withMessage("Invalid conversion mode"),

  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { text, mode } = req.body;
      let convertedText = '';

      // Perform conversion based on mode
      try {
        switch (mode) {
          case 'bijoy-to-unicode':
            convertedText = bijoyToUnicode(text);
            break;
          
          case 'unicode-to-bijoy':
            convertedText = unicodeToBijoy(text);
            break;
          
          default:
            return res.status(400).json({
              success: false,
              message: "Invalid conversion mode",
            });
        }
      } catch (conversionError) {
        console.error('Conversion error:', conversionError);
        return res.status(500).json({
          success: false,
          message: "Failed to convert text",
          error: conversionError.message,
        });
      }

      return res.json({
        success: true,
        message: "Text converted successfully",
        data: {
          originalText: text,
          convertedText: convertedText,
          mode: mode,
        },
      });

    } catch (error) {
      console.error('Bangla conversion error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to convert text",
      });
    }
  },
];

module.exports = {
  convertText,
};
