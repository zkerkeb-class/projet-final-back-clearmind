const express = require('express');
const methodologyController = require('../controllers/methodologyController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect); // Sécurisé par JWT

router.get('/kill-chain', methodologyController.getKillChain);
// router.patch('/update-step/:id', authController.restrictTo('admin'), methodologyController.updateStep);

module.exports = router;