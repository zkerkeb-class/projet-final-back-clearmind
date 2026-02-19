const express = require('express');
const router = express.Router();
const reverseShellController = require('../controllers/reverseShellController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware.protect);

router.route('/')
  .get(reverseShellController.getAllShells)
  .post(authMiddleware.restrictTo(ROLES.ADMIN), reverseShellController.createShell);

router.route('/:id')
  .patch(authMiddleware.restrictTo(ROLES.ADMIN), reverseShellController.updateShell)
  .delete(authMiddleware.restrictTo(ROLES.ADMIN), reverseShellController.deleteShell);

module.exports = router;