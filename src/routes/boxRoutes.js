const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const authController = require('../controllers/authController');

// Protéger toutes les routes ci-dessous (Authentification requise)
router.use(authController.protect);

router.route('/')
  .get(boxController.getAllBoxes)
  .post(authController.restrictTo('pentester', 'admin'), boxController.createBox);

router.route('/:id')
  .get(boxController.getBox)
  .delete(authController.restrictTo('pentester', 'admin'), boxController.deleteBox)
  .patch(authController.restrictTo('pentester', 'admin'), boxController.updateBox);

module.exports = router;