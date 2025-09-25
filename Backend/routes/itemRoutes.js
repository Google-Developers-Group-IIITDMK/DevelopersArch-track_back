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

const router = express.Router();

router.post("/", protect, createItem);
router.get("/", getItems);
router.get("/lost", getLostItems);
router.get("/found", getFoundItems);
router.get("/my-items", protect, getUserItems);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
