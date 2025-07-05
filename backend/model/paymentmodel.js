import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentmethod: { type: String, enum: ["cash", "card", "upi"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
