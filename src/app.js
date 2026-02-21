require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const payloadRouter = require('./routes/payloadRoutes');
const boxRouter = require('./routes/boxRoutes');
const targetRouter = require('./routes/targetRoutes');
const searchRouter = require('./routes/searchRoutes');
const globalErrorHandler = require('./controllers/errorController');
const wikiRouter = require('./routes/wikiRoutes');
const newsRouter = require('./routes/newsRoutes');
const methodologyRouter = require('./routes/methodologyRoutes');
const toolRouter = require('./routes/toolRoutes');
const reverseShellRouter = require('./routes/reverseShellRoutes');
const app = express();

// 1. Connexion DB
connectDB();

// 2. Middleware JSON (Indispensable pour lire req.body)
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques (images uploadées)
app.use(express.static(path.join(__dirname, '../public')));

// 3. Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/payloads', payloadRouter);
app.use('/api/v1/boxes', boxRouter);
app.use('/api/v1/targets', targetRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/wiki', wikiRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/methodology', methodologyRouter);
app.use('/api/v1/tools', toolRouter);
app.use('/api/v1/reverseshells', reverseShellRouter);

app.all('*path', (req, res, next) => {
  const err = new Error(`Impossible de trouver ${req.originalUrl} sur ce serveur !`);
  err.statusCode = 404;
  next(err);
});

// Middleware global d'erreur
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});