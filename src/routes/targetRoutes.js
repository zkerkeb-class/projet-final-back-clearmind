const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware.protect);

router.route('/')
  .get(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.getAllTargets)
  .post(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.createTarget);

router.route('/:id')
  .delete(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.deleteTarget)
  .patch(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), targetController.updateTarget);

module.exports = router;