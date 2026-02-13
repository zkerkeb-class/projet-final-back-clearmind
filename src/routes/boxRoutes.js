const express = require('express');
const boxController = require('../controllers/boxController');
const authController = require('../controllers/authController');

const router = express.Router();

// Sécurité : Il faut être connecté
router.use(authController.protect);

router
  .route('/')
  .get(boxController.getMyBoxes)
  .post(boxController.createBox);

router
  .route('/:id')
  .patch(boxController.updateBox);

module.exports = router;