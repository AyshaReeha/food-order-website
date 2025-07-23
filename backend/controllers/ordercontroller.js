import Order from "../model/ordermodel.js";
import Cart from "../model/cartmodel.js";
import Food from "../model/foodmodel.js";


export const placeOrder = async (req, res) => {
  try {
    const { delivery_address, deliverytime } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    const orders = [];

    for (const item of cart.items) {
      const order = await Order.create({
        user: req.user._id,
        food: item.food._id,
        restaurant: item.food.restaurant,
        quantity: item.quantity,
        amount: item.food.price * item.quantity,
        delivery_address,
        deliverytime,
      });

      orders.push(order);
    }


    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order(s) placed successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("food")
      .populate("restaurant")
      .sort({ orderdate: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
