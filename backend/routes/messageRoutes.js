import { Router } from "express";
import Message from "../models/Message.js";

const router = Router();

// GET all messages between student and teacher
router.get("/:studentId/:teacherId", async (req, res) => {
  const { studentId, teacherId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: studentId, receiver: teacherId },
      { sender: teacherId, receiver: studentId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

import mongoose from "mongoose";

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "name email") // populate sender with name and email
      .populate("receiver", "name email") // populate receiver with name and email
      .populate("appointmentId"); // optional if you want appointment details too

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get messages", details: error.message });
  }
});

//---------------
// GET messages by user (either sender or receiver)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .populate("appointmentId");

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user's messages", details: error.message });
  }
});

// GET messages by receiver ID with ObjectId check
// ✅ Get messages by receiver ID
router.get("/receiver/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in URL" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const messages = await Message.find({ receiver: userId })
      .populate("sender", "email")
      .populate("receiver", "email");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get receiver messages",
      message: error.message,
    });
  }
});

// GET messages for a specific teacher
// This endpoint fetches all messages where the teacher is either the sender or receiver

router.get("/teacher/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("appointmentId");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST a new message
router.post("/send", async (req, res) => {
  const { sender, receiver, content, appointmentId } = req.body;
  const msg = await Message.create({
    sender,
    receiver,
    content,
    appointmentId,
  });
  res.status(201).json(msg);
});

export default router;
