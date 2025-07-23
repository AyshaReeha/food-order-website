import Payment from "../model/paymentmodel.js";
import Order from "../model/ordermodel.js";

import Razorpay from "razorpay";




export const makePayment = async (req, res) => {
  try {
    const { orderId, paymentmethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "completed") {
      return res.status(400).json({ message: "Order already completed" });
    }

    const payment = await Payment.create({
      order: orderId,
      paymentmethod,
      amount: order.amount,
      status: "success",
    });

    
    order.status = "completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful",
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUserPayments = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).select("_id");
    const orderIds = orders.map(o => o._id);

    const payments = await Payment.find({ order: { $in: orderIds } }).populate("order");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






// Replace with your actual Razorpay key and secret
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// Create Razorpay order
export const createOrder= async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}