import Cart from "../model/cartmodel.js";
import Food from "../model/foodmodel.js";

// export const addToCart = async (req, res) => {
//   try {
//     const { foodId, quantity } = req.body;

//     let cart = await Cart.findOne({ user: req.user._id });

//     const food = await Food.findById(foodId);
//     if (!food) return res.status(404).json({ message: "Food not found" });

//     const itemAmount = food.price * quantity;

//     if (!cart) {
//       cart = new Cart({
//         user: req.user._id,
//         items: [{ food: foodId, quantity }],
//         totalAmount: itemAmount,
//       });
//     } else {
//       const index = cart.items.findIndex(item => item.food.toString() === foodId);
//       if (index !== -1) {
//         cart.items[index].quantity += quantity;
//       } else {
//         cart.items.push({ food: foodId, quantity });
//       }

//       cart.totalAmount += itemAmount;
//     }

//     await cart.save();
//     res.status(200).json({ success: true, cart });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    if (!userId || !foodId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔥 Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const objectUserId = new mongoose.Types.ObjectId(userId);
    let cart = await Cart.findOne({ user: objectUserId });

    const itemAmount = food.price * quantity;

    if (!cart) {
      cart = new Cart({
        user: objectUserId,
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
    console.error("Cart Add Error:", err); // ✅ log to terminal
    res.status(500).json({ message: err.message });
  }
};





// export const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
//     if (!cart) return res.status(404).json({ message: "Cart not found" });
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getCart = async (req, res) => {
  // console.log("User from protect:", req.user); // 👈 Debug

  // try {
  //   const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
  //   if (!cart) return res.status(404).json({ message: "Cart not found" });
  //   res.json(cart);
  // } catch (err) {
  //   console.error("Error fetching cart:", err); // 👈 Debug
  //   res.status(500).json({ message: err.message });
  //}
export const getCart = async (req, res) => {
  try {
    

    const { userId } = req.params || req.user?._id;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.food",
      match: {}, // no conditions, just to enable `.food` filtering
    });
    if (cart && cart.items) {
      // Filter out items where food is null (not populated)
      cart.items = cart.items.filter(item => item.food !== null);
    }

     // <--- populate food

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Server error" });
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
// POST /api/cart/update-quantity
export const updateQuantity = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    const index = cart.items.findIndex((item) => item.food.toString() === foodId);
    if (index === -1) return res.status(404).json({ message: "Item not in cart" });

    const food = await Food.findById(foodId);
    const prevQty = cart.items[index].quantity;

    cart.totalAmount -= food.price * prevQty;
    cart.items[index].quantity = quantity;
    cart.totalAmount += food.price * quantity;

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
