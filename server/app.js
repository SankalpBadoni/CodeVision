import express from 'express';
import cors from 'cors';
import generatorRoutes from './routes/generator.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', generatorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});