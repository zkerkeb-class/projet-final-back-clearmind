const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const authController = require('../controllers/authController');

// Tout utilisateur connecté peut voir un outil
router.get('/:name', authController.protect, toolController.getToolByName);

// SEUL l'administrateur peut créer des outils
router.post('/', 
  authController.protect, 
  authController.restrictTo('admin'), 
  toolController.createTool
);

router.get('/', authController.protect, toolController.getAllTools);

router.delete('/:name', 
  authController.protect, 
  authController.restrictTo('admin'), 
  toolController.deleteTool
);

module.exports = router;