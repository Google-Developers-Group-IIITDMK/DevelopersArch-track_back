import express from "express";
import {
  getMessagesByReport,
  createMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/report/:reportId", getMessagesByReport);
router.post("/report/:reportId", protect, createMessage);
router.delete("/:id", protect, deleteMessage);

export default router;
