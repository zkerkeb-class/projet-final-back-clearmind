const express = require('express');
const router = express.Router();
const wikiController = require('../controllers/wikiController');
const authController = require('../controllers/authController');
const { ROLES } = require('../utils/constants');

router.use(authController.protect);

router.route('/')
  .get(wikiController.getAllMethods)
  .post(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.createMethod);

router.route('/:id')
  .get(wikiController.getMethod)
  .patch(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.updateMethod)
  .delete(authController.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.deleteMethod);

module.exports = router;