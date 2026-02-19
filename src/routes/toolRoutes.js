const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

// Protection globale : Authentification JWT requise pour toutes les routes
router.use(authMiddleware.protect);

router.route('/')
  .get(toolController.getAllTools)
  .post(authMiddleware.restrictTo(ROLES.ADMIN), toolController.createTool);

router.route('/:name')
  .get(toolController.getToolByName)
  .patch(authMiddleware.restrictTo(ROLES.ADMIN), toolController.updateTool)
  .delete(authMiddleware.restrictTo(ROLES.ADMIN), toolController.deleteTool);

module.exports = router;