const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const authController = require('../controllers/authController');
const { ROLES } = require('../utils/constants');

router.use(authController.protect);

router.route('/')
  .get(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.getAllTargets)
  .post(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.createTarget);

router.route('/:id')
  .delete(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.deleteTarget)
  .patch(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.updateTarget);

module.exports = router;