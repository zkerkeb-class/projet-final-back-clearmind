const express = require('express');
const payloadController = require('../controllers/payloadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

// Route spécifique pour l'utilisateur connecté
router.get('/my-payloads', payloadController.getMyPayloads);

router.route('/')
  .get(payloadController.getAllPayloads)
  .post(authMiddleware.restrictTo('admin', 'pentester'), payloadController.createPayload);

router
  .route('/:id')
  .get(payloadController.getPayload)
  .patch(payloadController.updatePayload)
  .delete(payloadController.deletePayload);

module.exports = router;