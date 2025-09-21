import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

import { protect } from "../middleware/authMiddleware.js";

router.get("/me", protect, (req, res) => {
  res.json({ message: "User profile", user: req.user });
});
