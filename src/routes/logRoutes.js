const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

// Protection : Admin uniquement
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo(ROLES.ADMIN));

router.get('/', logController.getAllLogs);

module.exports = router;