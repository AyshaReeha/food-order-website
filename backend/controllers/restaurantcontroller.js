import Restaurant from "../model/restaurantmodel.js";


export const createRestaurant = async (req, res) => {
  try {
    const { restaurant_name, rating, location, image } = req.body;

    const restaurant = await Restaurant.create({
      restaurant_name,
      rating,
      location,
      image,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "Name Email");
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyRestaurants = async (req, res) => {
  try {
    const myRestaurants = await Restaurant.find({ owner: req.user._id });
    res.json(myRestaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
