import Cart from "../model/cartmodel.js";
import Food from "../model/foodmodel.js";

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const itemAmount = food.price * quantity;

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ food: foodId, quantity }],
        totalAmount: itemAmount,
      });
    } else {
      const index = cart.items.findIndex(item => item.food.toString() === foodId);
      if (index !== -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ food: foodId, quantity });
      }

      cart.totalAmount += itemAmount;
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.food._id.toString() === foodId);
    if (index === -1) return res.status(404).json({ message: "Food not in cart" });

    const foodPrice = cart.items[index].food.price;
    const quantity = cart.items[index].quantity;
    cart.totalAmount -= foodPrice * quantity;

    cart.items.splice(index, 1);
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
