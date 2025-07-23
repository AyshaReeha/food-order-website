import express from "express";
import protect from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import {
  addFood,
  deleteFood,
  searchFood,
  getAllFood,
} from "../controllers/foodcontroller.js";

const router = express.Router();

router.post("/", protect, checkRole(["owner"]), addFood);
router.delete("/:id", protect, checkRole(["owner"]), deleteFood);
router.get("/search", searchFood);
router.get("/", getAllFood);

export default router;
