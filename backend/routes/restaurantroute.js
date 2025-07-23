import express from "express";
import protect from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import {
  createRestaurant,
  getAllRestaurants,
  getMyRestaurants,
} from "../controllers/restaurantcontroller.js";

const router = express.Router();

router.post("/", protect, checkRole(["owner"]), createRestaurant);
router.get("/", getAllRestaurants);
router.get("/my", protect, checkRole(["owner"]), getMyRestaurants);

export default router;
