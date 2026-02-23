const express = require('express');
const payloadController = require('../controllers/payloadController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
  .get(payloadController.getAllPayloads)
  .post(authMiddleware.restrictTo(ROLES.ADMIN, ROLES.PENTESTER), payloadController.createPayload);

router
  .route('/:id')
  .get(payloadController.getPayload)
  .patch(payloadController.updatePayload)
  .delete(payloadController.deletePayload);

module.exports = router;