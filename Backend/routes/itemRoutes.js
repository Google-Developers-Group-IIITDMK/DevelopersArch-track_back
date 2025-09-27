import express from "express";
import { 
  createItem, 
  getItems, 
  getLostItems, 
  getFoundItems, 
  getUserItems,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";
import parser from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, parser.single("image"), createItem);
router.get("/", getItems);
router.get("/lost", getLostItems);
router.get("/found", getFoundItems);
router.get("/my-items", protect, getUserItems);
router.put("/:id", protect, parser.single("image"), updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
