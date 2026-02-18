const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
  .get(targetController.getAllTargets)
  .post(authController.restrictTo('pentester', 'admin'), targetController.createTarget);

router.route('/:id')
  .delete(authController.restrictTo('pentester', 'admin'), targetController.deleteTarget)
  .patch(authController.restrictTo('pentester', 'admin'), targetController.updateTarget);

module.exports = router;