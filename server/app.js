import express from 'express';
import cors from 'cors';
import generatorRoutes from './routes/generator.js';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
})

// Routes
app.use('/api', generatorRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});