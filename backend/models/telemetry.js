/**
 * Telemetry Model
 *
 * This module handles the storage and retrieval of anonymous telemetry data
 * using MongoDB for persistent storage.
 */

const mongoose = require("mongoose");

// Define the telemetry schema
const telemetrySchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true,
        },
        suggestionsShown: {
            type: Number,
            default: 0,
        },
        suggestionsAccepted: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Create the model
const TelemetryModel = mongoose.model("Telemetry", telemetrySchema);

/**
 * Record telemetry data
 *
 * @param {Object} data - The telemetry data to record
 * @param {number} data.suggestionsShown - Number of suggestions shown
 * @param {number} data.suggestionsAccepted - Number of suggestions accepted
 * @returns {Promise<Object>} - The updated daily metrics
 */
async function recordTelemetry(data) {
    const { suggestionsShown = 0, suggestionsAccepted = 0 } = data;

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    try {
        // Find and update the telemetry data for today, or create if it doesn't exist
        const result = await TelemetryModel.findOneAndUpdate(
            { date: today },
            {
                $inc: {
                    suggestionsShown: suggestionsShown,
                    suggestionsAccepted: suggestionsAccepted,
                },
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create if it doesn't exist
            }
        );

        return {
            suggestionsShown: result.suggestionsShown,
            suggestionsAccepted: result.suggestionsAccepted,
        };
    } catch (error) {
        console.error("Error recording telemetry:", error);
        throw error;
    }
}

/**
 * Get daily telemetry data
 *
 * @param {string} [date] - The date to get data for (YYYY-MM-DD format)
 * @returns {Promise<Object>} - The daily metrics
 */
async function getDailyTelemetry(date) {
    const targetDate = date || new Date().toISOString().split("T")[0];

    try {
        const result = await TelemetryModel.findOne({ date: targetDate });

        if (!result) {
            return { suggestionsShown: 0, suggestionsAccepted: 0 };
        }

        return {
            suggestionsShown: result.suggestionsShown,
            suggestionsAccepted: result.suggestionsAccepted,
        };
    } catch (error) {
        console.error("Error getting daily telemetry:", error);
        throw error;
    }
}

/**
 * Get all telemetry data
 *
 * @returns {Promise<Object>} - All telemetry data
 */
async function getAllTelemetry() {
    try {
        const results = await TelemetryModel.find().sort({ date: -1 });

        // Format the results
        const daily = {};
        results.forEach((result) => {
            daily[result.date] = {
                suggestionsShown: result.suggestionsShown,
                suggestionsAccepted: result.suggestionsAccepted,
            };
        });

        return { daily };
    } catch (error) {
        console.error("Error getting all telemetry:", error);
        throw error;
    }
}

module.exports = {
    recordTelemetry,
    getDailyTelemetry,
    getAllTelemetry,
};
