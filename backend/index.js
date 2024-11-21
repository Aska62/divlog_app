import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/UserRoutes.js';
import diveRecordRoutes from './routes/DiveRecordRoutes.js';
import countryRoutes from './routes/CountryRoutes.js';
import divePurposeRoutes from './routes/DivePurposeRoutes.js';

dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// json
app.use(express.json());

// cors
const corsOptions = {
  origin: process.env.NEXT_APP_URL,
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions));

// cookie parser
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

// routes settings
app.get('/', (req, res) => {
  res.send('test')
});

app.use('/api/users', userRoutes);
app.use('/api/diveRecords', diveRecordRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/divePurposes', divePurposeRoutes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));