import express from "express";
import protect from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import {
  addFood,
  deleteFood,
  searchFood,
  getAllFood,
  getFoodsByRestaurant,
  getFoodsByOwner,
  updateFood,
  
} from "../controllers/foodcontroller.js";

const router = express.Router();

router.post("/", protect, checkRole(["owner"]), addFood);
router.delete("/:id", protect, deleteFood);
router.get("/search", searchFood);
router.get("/", getAllFood);
router.get("/byrestaurant/:id", getFoodsByRestaurant);
router.get("/", protect, getFoodsByOwner);
router.put("/:id", protect, checkRole(["owner"]), updateFood);

export default router;
