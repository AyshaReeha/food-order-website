import express from "express";
import protect from "../middleware/auth.js";
import { makePayment, getUserPayments } from "../controllers/paymentcontroller.js";

const router = express.Router();

router.post("/", protect, makePayment);
router.get("/", protect, getUserPayments);

export default router;
