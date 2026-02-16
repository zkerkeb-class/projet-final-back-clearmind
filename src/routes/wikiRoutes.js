const express = require('express');
const wikiController = require('../controllers/wikiController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect); // Toutes les routes wiki sont protégées

router.route('/')
  .get(wikiController.getAllMethods)
  .post(wikiController.createMethod);

router.route('/:id')
  .get(wikiController.getMethod);

module.exports = router;