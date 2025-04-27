/**
 * Telemetry Model
 * 
 * This module handles the storage and retrieval of anonymous telemetry data.
 * For simplicity, it uses in-memory storage, but could be extended to use
 * a database in a production environment.
 */

// In-memory storage for telemetry data
const telemetryData = {
  daily: {} // Format: { 'YYYY-MM-DD': { suggestionsShown: 0, suggestionsAccepted: 0 } }
};

/**
 * Record telemetry data
 * 
 * @param {Object} data - The telemetry data to record
 * @param {number} data.suggestionsShown - Number of suggestions shown
 * @param {number} data.suggestionsAccepted - Number of suggestions accepted
 * @returns {Object} - The updated daily metrics
 */
function recordTelemetry(data) {
  const { suggestionsShown = 0, suggestionsAccepted = 0 } = data;
  
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize today's data if it doesn't exist
  if (!telemetryData.daily[today]) {
    telemetryData.daily[today] = {
      suggestionsShown: 0,
      suggestionsAccepted: 0
    };
  }
  
  // Update the counts
  telemetryData.daily[today].suggestionsShown += suggestionsShown;
  telemetryData.daily[today].suggestionsAccepted += suggestionsAccepted;
  
  return telemetryData.daily[today];
}

/**
 * Get daily telemetry data
 * 
 * @param {string} [date] - The date to get data for (YYYY-MM-DD format)
 * @returns {Object} - The daily metrics
 */
function getDailyTelemetry(date) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  return telemetryData.daily[targetDate] || { suggestionsShown: 0, suggestionsAccepted: 0 };
}

/**
 * Get all telemetry data
 * 
 * @returns {Object} - All telemetry data
 */
function getAllTelemetry() {
  return telemetryData;
}

module.exports = {
  recordTelemetry,
  getDailyTelemetry,
  getAllTelemetry
};
