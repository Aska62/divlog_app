import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';

dotenv.config();

const prisma = new PrismaClient();

const app = express();

// json
app.use(express.json());

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
});

app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));