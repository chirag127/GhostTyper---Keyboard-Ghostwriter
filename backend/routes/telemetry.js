/**
 * Telemetry Router
 * 
 * This router handles requests for recording and retrieving
 * anonymous telemetry data.
 */

const express = require('express');
const router = express.Router();
const { recordTelemetry, getDailyTelemetry, getAllTelemetry } = require('../models/telemetry');

/**
 * POST /api/telemetry
 * 
 * Record telemetry data
 * 
 * Request body:
 * - suggestionsShown: Number of suggestions shown
 * - suggestionsAccepted: Number of suggestions accepted
 * 
 * Response:
 * - The updated daily metrics
 */
router.post('/', (req, res, next) => {
  try {
    // Validate request body
    const { suggestionsShown, suggestionsAccepted } = req.body;
    
    if (typeof suggestionsShown !== 'number' || typeof suggestionsAccepted !== 'number') {
      return res.status(400).json({ 
        error: 'suggestionsShown and suggestionsAccepted must be numbers' 
      });
    }
    
    // Record the telemetry data
    const updatedMetrics = recordTelemetry({
      suggestionsShown,
      suggestionsAccepted
    });
    
    // Return the updated metrics
    res.status(200).json(updatedMetrics);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/telemetry/daily
 * 
 * Get daily telemetry data
 * 
 * Query parameters:
 * - date: The date to get data for (YYYY-MM-DD format)
 * 
 * Response:
 * - The daily metrics
 */
router.get('/daily', (req, res, next) => {
  try {
    const { date } = req.query;
    const metrics = getDailyTelemetry(date);
    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/telemetry/all
 * 
 * Get all telemetry data
 * 
 * Response:
 * - All telemetry data
 */
router.get('/all', (req, res, next) => {
  try {
    const metrics = getAllTelemetry();
    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
