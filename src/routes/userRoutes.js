const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Routes publiques
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protection globale
router.use(authController.protect);

router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Routes Admin
router.route('/')
  .get(authController.restrictTo('admin'), authController.getAllUsers)
  .post(authController.restrictTo('admin'), authController.createUser);

router.route('/:id')
  .patch(authController.restrictTo('admin'), authController.updateUser)
  .delete(authController.restrictTo('admin'), authController.deleteUser);

module.exports = router;