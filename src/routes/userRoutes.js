const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes publiques
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protection globale
router.use(authMiddleware.protect);

router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Routes Admin
router.route('/')
  .get(authMiddleware.restrictTo('admin'), authController.getAllUsers)
  .post(authMiddleware.restrictTo('admin'), authController.createUser);

router.route('/:id')
  .patch(authMiddleware.restrictTo('admin'), authController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), authController.deleteUser);

module.exports = router;