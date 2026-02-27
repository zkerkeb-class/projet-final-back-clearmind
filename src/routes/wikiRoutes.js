const express = require('express');
const router = express.Router();
const wikiController = require('../controllers/wikiController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware.protect);

router.route('/')
  .get(wikiController.getAllMethods)
  .post(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.createMethod);

router.route('/:id')
  .get(wikiController.getMethod)
  .patch(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.updateMethod)
  .delete(authMiddleware.restrictTo(ROLES.PENTESTER, ROLES.ADMIN), wikiController.deleteMethod);

module.exports = router;