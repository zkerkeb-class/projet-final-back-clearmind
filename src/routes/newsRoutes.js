const express = require('express');
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Optionnel : tu peux décider que la veille est accessible sans être logué, 
// mais pour RedSheet, on va la protéger :
router.use(authMiddleware.protect);

router.get('/', newsController.getLatestNews);

module.exports = router;