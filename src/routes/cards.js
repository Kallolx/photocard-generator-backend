const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/cards/generate
 * @desc    Record card generation and increment credits
 * @access  Private
 */
router.post('/generate', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { card_type, source_url, theme, is_batch = false, batch_count = 1 } = req.body;

    // Check if user can generate cards (daily limit)
    const credits = await query(
      `SELECT daily_limit, cards_generated_today, last_reset_date, batch_processing_enabled 
       FROM user_credits WHERE user_id = ?`,
      [userId]
    );

    if (credits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User credits not found',
      });
    }

    // Check if user is trying to use batch processing without permission
    if (is_batch && !credits[0].batch_processing_enabled) {
      return res.status(403).json({
        success: false,
        message: 'Batch processing is only available for Premium users',
        code: 'PREMIUM_REQUIRED',
      });
    }

    const userCredits = credits[0];
    const today = new Date().toISOString().split('T')[0];
    const lastReset = new Date(userCredits.last_reset_date).toISOString().split('T')[0];

    // Reset credits if it's a new day
    if (today !== lastReset) {
      await query(
        `UPDATE user_credits 
         SET cards_generated_today = 0, last_reset_date = CURDATE() 
         WHERE user_id = ?`,
        [userId]
      );
      userCredits.cards_generated_today = 0;
    }

    // Check if user has reached daily limit (unlimited = -1)
    if (userCredits.daily_limit !== -1) {
      const cardsToGenerate = is_batch ? batch_count : 1;
      if (userCredits.cards_generated_today + cardsToGenerate > userCredits.daily_limit) {
        return res.status(403).json({
          success: false,
          message: 'Daily card generation limit reached',
          code: 'LIMIT_REACHED',
          data: {
            daily_limit: userCredits.daily_limit,
            cards_generated_today: userCredits.cards_generated_today,
            remaining: userCredits.daily_limit - userCredits.cards_generated_today,
          },
        });
      }
    }

    // Record card generation and increment credits
    await transaction(async (connection) => {
      // Insert card generation record
      await connection.execute(
        `INSERT INTO card_generations 
         (user_id, card_type, source_url, is_batch, batch_count, theme, download_allowed, ip_address) 
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [userId, card_type, source_url, is_batch, batch_count, theme, req.ip]
      );

      // Increment cards generated
      const cardsToAdd = is_batch ? batch_count : 1;
      await connection.execute(
        `UPDATE user_credits 
         SET cards_generated_today = cards_generated_today + ?,
             total_cards_generated = total_cards_generated + ?
         WHERE user_id = ?`,
        [cardsToAdd, cardsToAdd, userId]
      );
    });

    // Get updated credits
    const updatedCredits = await query(
      `SELECT daily_limit, cards_generated_today, last_reset_date, 
              total_cards_generated 
       FROM user_credits WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Card generation recorded successfully',
      data: {
        credits: updatedCredits[0],
        remaining: updatedCredits[0].daily_limit === -1 
          ? -1 
          : updatedCredits[0].daily_limit - updatedCredits[0].cards_generated_today,
      },
    });
  } catch (error) {
    console.error('Card generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record card generation',
    });
  }
});

/**
 * @route   GET /api/cards/check-limit
 * @desc    Check if user can generate more cards
 * @access  Private
 */
router.get('/check-limit', authenticate, async (req, res) => {
  try {
    const credits = await query(
      `SELECT daily_limit, cards_generated_today, last_reset_date 
       FROM user_credits WHERE user_id = ?`,
      [req.userId]
    );

    if (credits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User credits not found',
      });
    }

    const userCredits = credits[0];
    const today = new Date().toISOString().split('T')[0];
    const lastReset = new Date(userCredits.last_reset_date).toISOString().split('T')[0];

    // Reset credits if new day
    if (today !== lastReset) {
      await query(
        `UPDATE user_credits 
         SET cards_generated_today = 0, last_reset_date = CURDATE() 
         WHERE user_id = ?`,
        [req.userId]
      );
      userCredits.cards_generated_today = 0;
    }

    const canGenerate = userCredits.daily_limit === -1 || 
                        userCredits.cards_generated_today < userCredits.daily_limit;
    const remaining = userCredits.daily_limit === -1 
      ? -1 
      : userCredits.daily_limit - userCredits.cards_generated_today;

    res.json({
      success: true,
      data: {
        can_generate: canGenerate,
        daily_limit: userCredits.daily_limit,
        cards_generated_today: userCredits.cards_generated_today,
        remaining,
      },
    });
  } catch (error) {
    console.error('Check limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check generation limit',
    });
  }
});

module.exports = router;
