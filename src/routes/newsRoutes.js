const express = require('express');
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', newsController.getLatestNews);

module.exports = router;