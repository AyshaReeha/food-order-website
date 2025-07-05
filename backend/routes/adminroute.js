import express from "express";
import protect from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import {
  getAllUsers,
  getAllOwners,
  deleteUserOrOwner,
  getAllOrders,
  getAllPayments
} from "../controllers/admincontroller.js";

const router = express.Router();

router.use(protect, checkRole(["admin"]));

router.get("/users", getAllUsers);
router.get("/owners", getAllOwners);
router.delete("/user/:id", deleteUserOrOwner);
router.get("/orders", getAllOrders);
router.get("/payments", getAllPayments);

export default router;
