import express from "express";
import protect from "../middleware/auth.js";
import { placeOrder, getUserOrders } from "../controllers/ordercontroller.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);

export default router;
