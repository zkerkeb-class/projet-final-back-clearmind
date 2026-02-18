const express = require('express');
const router = express.Router();
const wikiController = require('../controllers/wikiController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
  .get(wikiController.getAllMethods)
  .post(authController.restrictTo('pentester', 'admin'), wikiController.createMethod);

router.route('/:id')
  .get(wikiController.getMethod)
  .patch(authController.restrictTo('pentester', 'admin'), wikiController.updateMethod)
  .delete(authController.restrictTo('pentester', 'admin'), wikiController.deleteMethod);

module.exports = router;