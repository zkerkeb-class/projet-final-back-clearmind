const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const authController = require('../controllers/authController');
const { ROLES } = require('../utils/constants');

// Tout utilisateur connecté peut voir un outil
router.get('/:name', authController.protect, toolController.getToolByName);

// SEUL l'administrateur peut créer des outils
router.post('/', 
  authController.protect, 
  authController.restrictTo(ROLES.ADMIN), 
  toolController.createTool
);

router.get('/', authController.protect, toolController.getAllTools);

// Route de modification sécurisée (Admin uniquement)
router.patch('/:name', 
  authController.protect, 
  authController.restrictTo(ROLES.ADMIN), 
  toolController.updateTool
);

router.delete('/:name', 
  authController.protect, 
  authController.restrictTo(ROLES.ADMIN), 
  toolController.deleteTool
);

module.exports = router;