const express = require('express');
const methodologyController = require('../controllers/methodologyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect); // Sécurisé par JWT

router.get('/kill-chain', methodologyController.getKillChain);
// router.patch('/update-step/:id', authController.restrictTo('admin'), methodologyController.updateStep);

module.exports = router;