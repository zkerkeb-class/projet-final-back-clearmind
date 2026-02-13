const express = require('express');
const targetController = require('../controllers/targetController');
const authController = require('../controllers/authController');

const router = express.Router();

// Middleware de protection global pour toutes les routes Target
router.use(authController.protect);

router
  .route('/')
  .get(targetController.getMyTargets)
  .post(targetController.createTarget);

module.exports = router;