require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const payloadRouter = require('./routes/payloadRoutes');
const boxRouter = require('./routes/boxRoutes');

const app = express();

// 1. Connexion DB
connectDB();

// 2. Middleware JSON (Indispensable pour lire req.body)
app.use(express.json());

// 3. Tes Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/payloads', payloadRouter);
app.use('/api/v1/boxes', boxRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});