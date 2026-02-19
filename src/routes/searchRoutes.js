const express = require('express');
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.protect, searchController.globalSearch);

module.exports = router;