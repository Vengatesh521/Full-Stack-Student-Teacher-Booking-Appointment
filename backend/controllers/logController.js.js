import Log from "../models/Log.js";
import User from "../models/user.js";

// Create a log entry
export const createLog = async (action, userId, details = "") => {
  try {
    const log = new Log({
      action,
      user: userId,
      details,
    });
    await log.save();
    // Optional: console.log or external logger
    console.log(`Log created: ${action} by ${userId}`);
  } catch (error) {
    console.error("Error creating log:", error);
  }
};

// Get all logs (Admin)
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "username role email")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get logs by user ID
export const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await Log.find({ user: userId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get logs by action type
export const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const logs = await Log.find({ action }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching action logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
