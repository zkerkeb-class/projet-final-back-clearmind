const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const authController = require('../controllers/authController');
const { ROLES } = require('../utils/constants');

// Protéger toutes les routes ci-dessous (Authentification requise)
router.use(authController.protect);

router.route('/')
  .get(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.getAllBoxes)
  .post(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.createBox);

router.route('/:id')
  .get(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.getBox)
  .delete(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.deleteBox)
  .patch(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.updateBox);

module.exports = router;