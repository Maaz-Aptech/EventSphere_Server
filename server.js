// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import seedAdmin from './config/seedAdmin.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (cached for serverless)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");

    // ✅ Seed default admin if none exists
    await seedAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

// routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/', async (req, res) => {
  await connectDB();
  res.send('Server is running with MongoDB Atlas...');
});

// error handlers
app.use(notFound);
app.use(errorHandler);

// ❌ DO NOT use app.listen() on Vercel
// ✅ Instead, export the app
export default app;
