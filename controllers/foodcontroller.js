import Food from "../model/foodmodel.js";
import Restaurant from "../model/restaurantmodel.js";
import mongoose from "mongoose";


export const addFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteFood = async (req, res) => {
  const foodId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({ message: "Invalid food ID" });
  }

  try {
    const food = await Food.findByIdAndDelete(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error during deletion" });
  }
};


// export const searchFood = async (req, res) => {
//   const { query } = req.query;
//   try {
//     const foods = await Food.find({
//       $or: [
//         { food_name: new RegExp(query, "i") },
//       ],
//     }).populate("restaurant");

//     res.json(foods);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



export const searchFood = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: "Food name is required" });
    }

    const normalized = name.replace(/\s+/g, "").toLowerCase();

    const foods = await Food.find().populate({
      path: "restaurant",
      select: "restaurant_name image location rating", // get relevant restaurant details
    });

    const matchedFoods = foods.filter((f) =>
      f.food_name.replace(/\s+/g, "").toLowerCase().includes(normalized)
    );

    if (matchedFoods.length === 0) {
      return res.status(404).json({ success: false, message: "No matching foods found" });
    }

    res.status(200).json({ success: true, foods: matchedFoods });
  } catch (err) {
    console.error("Food search error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurant");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getFoodsByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const foods = await Food.find({ restaurant: id }).populate("restaurant", "restaurant_name image location rating");

    if (!foods || foods.length === 0) {
      return res.status(404).json({ success: false, message: "No foods found for this restaurant" });
    }

    res.status(200).json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getFoodsByOwner = async (req, res) => {
  try {
    // Step 1: Get restaurants owned by this user
    const ownerRestaurants = await Restaurant.find({ owner: req.user._id });

    const restaurantIds = ownerRestaurants.map((r) => r._id);

    // Step 2: Find foods in those restaurants
    const foods = await Food.find({ restaurant: { $in: restaurantIds } }).populate("restaurant");

    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Optional: Ensure only the owner of the restaurant can edit
    // You can skip this check if unnecessary
    // if (food.restaurant.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    const { food_name, price, food_type, image } = req.body;

    food.food_name = food_name || food.food_name;
    food.price = price || food.price;
    food.food_type = food_type || food.food_type;
    food.image = image || food.image;

    await food.save();

    res.status(200).json({ message: "Food updated", food });
  } catch (err) {
    console.error("Error updating food:", err);
    res.status(500).json({ message: "Server error" });
  }
};