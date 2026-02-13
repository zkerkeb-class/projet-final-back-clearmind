const express = require('express');
const payloadController = require('../controllers/payloadController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Route spécifique pour l'utilisateur connecté
router.get('/my-payloads', payloadController.getMyPayloads);

router
  .route('/')
  .get(payloadController.getAllPayloads)
  .post(payloadController.createPayload);

router
  .route('/:id')
  .patch(payloadController.updatePayload)
  .delete(payloadController.deletePayload);

module.exports = router;