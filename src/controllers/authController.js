const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { ROLES } = require('../utils/constants');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 1. Inscription
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: ROLES.GUEST
  });

  const token = signToken(newUser._id, newUser.role);
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});

// 2. Connexion
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Veuillez fournir un email et un mot de passe");
    error.statusCode = 400;
    return next(error);
  }
  
  // Sécurité : Force la conversion en String pour éviter les injections NoSQL (ex: { "$ne": null })
  const user = await User.findOne({ email: String(email) }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    return next(error);
  }
  const token = signToken(user._id, user.role);
  res.status(200).json({ status: 'success', token, role: user.role });
});

// --- LES FONCTIONS QUI MANQUAIENT PEUT-ÊTRE OU ÉTAIENT MAL PLACÉES ---

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  res.status(200).json({ status: 'success', data: users });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return next(new Error("Utilisateur non trouvé"));
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new Error("Utilisateur non trouvé"));
  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || ROLES.GUEST
  });
  newUser.password = undefined;
  res.status(201).json({ status: 'success', data: { user: newUser } });
});