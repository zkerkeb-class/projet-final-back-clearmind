const express = require('express');
const methodologyController = require('../controllers/methodologyController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect); // Sécurisé par JWT

router.get('/kill-chain', methodologyController.getKillChain);

module.exports = router;