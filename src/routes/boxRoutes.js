const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

// Protéger toutes les routes ci-dessous (Authentification requise)
router.use(authMiddleware.protect);

router.route('/')
  .get(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.getAllBoxes)
  .post(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.createBox);

router.route('/:id')
  .get(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.getBox)
  .delete(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.deleteBox)
  .patch(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), boxController.updateBox);

module.exports = router;