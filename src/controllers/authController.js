const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Fonction pour créer le Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token, // On envoie le badge au client
      data: { user: newUser }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token, // Le badge est généré ici aussi
      message: 'Connexion réussie !'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) On vérifie si le token est présent dans les headers (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource." });
    }

    // 2) Vérification du token (est-ce que la signature est bonne et est-ce qu'il a expiré ?)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) On vérifie si l'utilisateur existe toujours en base
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "L'utilisateur propriétaire de ce token n'existe plus." });
    }

    // 4) On autorise l'accès et on stocke l'utilisateur dans 'req' pour les prochaines étapes
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Token invalide ou expiré' });
  }
};