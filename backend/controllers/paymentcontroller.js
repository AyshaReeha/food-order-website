import Payment from "../model/paymentmodel.js";
import Order from "../model/ordermodel.js";


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
