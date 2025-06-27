// 
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();


import authRoutes from './routes/userroutes.js';
import { connectDB } from './config/db.js';

// const cartRoutes = require('./routes/cartroutes');
// const orderRoutes = require('./routes/orderroutes');
// const paymentRoutes = require('./routes/paymentroutes');

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/api/payment', paymentRoutes);

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
