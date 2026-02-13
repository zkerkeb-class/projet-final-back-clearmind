const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// --- ROUTES PUBLIQUES ---
// N'importe qui peut s'inscrire ou se connecter
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// --- ROUTES PROTÉGÉES ---
// On applique le middleware 'protect' à toutes les routes qui suivent
router.use(authController.protect);

// Cette route sert à récupérer les infos de l'utilisateur connecté
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;