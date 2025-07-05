import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  orderdate: { type: Date, default: Date.now },
  deliverytime: { type: String },
  delivery_address: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Order", orderSchema);
