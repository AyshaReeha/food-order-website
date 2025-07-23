import Food from "../model/foodmodel.js";


export const addFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    // Optional: Ensure only owner of the restaurant can delete
    if (food.restaurant.toString() !== req.body.restaurantId) {
      return res.status(403).json({ message: "Unauthorized to delete this food item" });
    }

    await food.deleteOne();
    res.json({ success: true, message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const searchFood = async (req, res) => {
  const { query } = req.query;
  try {
    const foods = await Food.find({
      $or: [
        { food_name: new RegExp(query, "i") },
      ],
    }).populate("restaurant");

    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
