const express = require('express');
const wikiController = require('../controllers/wikiController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect); // Toutes les routes wiki sont protégées

router.route('/')
  .get(wikiController.getAllMethods) // Tout le monde peut lire
  .post(authController.restrictTo('admin', 'pentester'), wikiController.createMethod); // Seul le staff écrit

router.route('/:id')
  .get(wikiController.getMethod)
  .patch(authController.restrictTo('admin', 'pentester'), wikiController.updateMethod);

module.exports = router;