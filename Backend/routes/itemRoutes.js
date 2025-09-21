import express from "express";
import ItemReport from "../models/ItemReport.js";

const router = express.Router();

router.post("/lost", async (req, res) => {
  try {
    const item = new ItemReport({ ...req.body, status: "lost" });
    await item.save();
    res.json({ success: true, message: "Lost item reported", item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/found", async (req, res) => {
  try {
    const item = new ItemReport({ ...req.body, status: "found" });
    await item.save();
    res.json({ success: true, message: "Found item reported", item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await ItemReport.find().populate("reportedBy", "name email");
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
