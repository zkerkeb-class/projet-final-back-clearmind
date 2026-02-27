const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

router.use(authMiddleware.protect);

// Permettre la création de logs manuels (Exports) pour Pentesters et Admins
router.post('/', authMiddleware.restrictTo(ROLES.ADMIN, ROLES.PENTESTER), logController.createLogManual);

// Le reste est réservé aux Admins (Lecture / Purge)
router.use(authMiddleware.restrictTo(ROLES.ADMIN));

router.get('/', logController.getAllLogs);
router.delete('/', logController.deleteAllLogs);

module.exports = router;