import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
} from "../controllers/usercontroller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", protect,getUserProfile);

export default router;

