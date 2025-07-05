import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  description: String,
  food_type: String, // e.g., veg/non-veg/dessert/etc.
  price: { type: Number, required: true },
  image: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

export default mongoose.model("Food", foodSchema);
