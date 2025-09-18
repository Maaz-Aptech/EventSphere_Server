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
import seedAdmin from './config/seedAdmin.js'; // ✅ Import admin seeder

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect db
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://smmaazaptechmlr_db_user:EventSphereTechwiz6@eventsphere.ykidunn.mongodb.net/EventSphere';

mongoose
  .connect(MONGO_URI, {})
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // ✅ Seed default admin if none exists
    await seedAdmin();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => res.send('Server is running...'));

// error handlers (optional)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
