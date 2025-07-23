import express from "express";
import protect from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../controllers/cartcontroller.js";

const router = express.Router();

router.post("/add", addToCart);
// router.get("/",protect, getCart);
router.get("/:userId", getCart); // Add this route

router.post("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);
router.post("/update-quantity", protect, updateQuantity);


export default router;
