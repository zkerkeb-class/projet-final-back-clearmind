const express = require('express');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, searchController.globalSearch);

module.exports = router;