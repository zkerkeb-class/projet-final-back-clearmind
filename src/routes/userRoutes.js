const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { ROLES } = require('../utils/constants');

// Routes publiques
router.post('/signup', authController.uploadUserPhoto, authController.signup);
router.post('/login', authController.login);

// Protection globale
router.use(authMiddleware.protect);

router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Modification de profil
router.patch('/updateMe', authController.uploadUserPhoto, authController.updateMe);
router.patch('/updateMyPassword', authController.updateMyPassword);

// Routes Admin
router.route('/')
  .get(authMiddleware.restrictTo(ROLES.ADMIN), authController.getAllUsers)
  .post(authMiddleware.restrictTo(ROLES.ADMIN), authController.createUser);

router.route('/:id')
  .patch(authMiddleware.restrictTo(ROLES.ADMIN), authController.updateUser)
  .delete(authMiddleware.restrictTo(ROLES.ADMIN), authController.deleteUser);

module.exports = router;