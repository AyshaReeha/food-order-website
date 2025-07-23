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

export const searchRestaurantsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Restaurant name is required" });
    }

    const normalized = name.replace(/\s+/g, "").toLowerCase();

    const restaurants = await Restaurant.find()
      .populate("owner", "Name Email") // 👈 this populates owner
      .lean();

    const matchingRestaurants = restaurants.filter((r) =>
      r.restaurant_name.replace(/\s+/g, "").toLowerCase() === normalized
    );

    if (matchingRestaurants.length === 0) {
      return res.status(404).json({ success: false, message: "No match found" });
    }

    res.json({ success: true, restaurants: matchingRestaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!restaurant.owner) {
      return res.status(400).json({ message: "Owner info missing in restaurant" });
    }

    if (
      !req.user || (
        req.user.role !== "admin" &&
        restaurant.owner.toString() !== req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await restaurant.deleteOne();
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find the restaurant
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Only allow owner to update their own restaurant
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update fields
    restaurant.restaurant_name = updatedData.restaurant_name || restaurant.restaurant_name;
    restaurant.location = updatedData.location || restaurant.location;
    restaurant.rating = updatedData.rating || restaurant.rating;
    restaurant.image = updatedData.image || restaurant.image;

    await restaurant.save();
    res.status(200).json({ success: true, restaurant });
  } catch (err) {
    console.error("Update Restaurant Error:", err);
    res.status(500).json({ message: err.message });
  }
};