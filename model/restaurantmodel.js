import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurant_name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  location: { type: String, required: true },
  image: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Restaurant", restaurantSchema);
