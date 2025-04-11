import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import generatorRoutes from './routes/generator.js';
import authRoutes from './routes/auth.route.js';
import projectRoutes from './routes/project.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://code-vision-two.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); 


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});


app.use('/api', generatorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});