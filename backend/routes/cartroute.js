import express from "express";
import protect from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartcontroller.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.post("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
