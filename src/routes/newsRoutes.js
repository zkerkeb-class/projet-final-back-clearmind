const express = require('express');
const newsController = require('../controllers/newsController');
const authController = require('../controllers/authController');

const router = express.Router();

// Optionnel : tu peux décider que la veille est accessible sans être logué, 
// mais pour RedSheet, on va la protéger :
router.use(authController.protect);

router.get('/', newsController.getLatestNews);

module.exports = router;