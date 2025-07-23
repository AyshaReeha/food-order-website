// 
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();


import authRoutes from './routes/userroutes.js';
import { connectDB } from './config/db.js';
import restaurantRoutes from "./routes/restaurantroute.js";
import foodRoutes from "./routes/foodroute.js";
import cartRoutes from "./routes/cartroute.js";
import orderRoutes from "./routes/orderroute.js";
import paymentRoutes from "./routes/paymentroutes.js";
import adminRoutes from "./routes/adminroute.js";



const app = express();
const port = process.env.PORT
app.use(cors({
  origin: "http://localhost:5173", // or wherever your React app runs
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);


const startServer = async () => {
  try {
    await connectDB();
    

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  }
};

startServer();
