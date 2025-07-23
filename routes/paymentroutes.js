import express from "express";
import protect from "../middleware/auth.js";
import { makePayment, getUserPayments, createOrder } from "../controllers/paymentcontroller.js";


const router = express.Router();

router.post("/", protect, makePayment);
router.get("/", protect, getUserPayments);
router.post("/create-order", createOrder);

export default router;
