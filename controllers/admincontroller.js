import User from "../model/usermodel.js";
import Order from "../model/ordermodel.js";
import Payment from "../model/paymentmodel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-Password"); // Exclude password
    res.json(users); // ✅ Make sure this is an array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" }).select("-Password");
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteUserOrOwner = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `${user.role} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "Name Email")
      .populate("food", "food_name")
      .populate("restaurant", "restaurant_name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("order")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
