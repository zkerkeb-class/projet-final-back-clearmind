const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 1. Inscription
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'guest'
  });

  const token = signToken(newUser._id);
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
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    return next(error);
  }
  const token = signToken(user._id);
  res.status(200).json({ status: 'success', token, role: user.role });
});

// 3. Middleware de protection
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    const error = new Error("Vous n'êtes pas connecté");
    error.statusCode = 401;
    return next(error);
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    const error = new Error("L'utilisateur n'existe plus");
    error.statusCode = 401;
    return next(error);
  }
  req.user = currentUser;
  next();
});

// 4. Restriction par rôle
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error("Permission refusée");
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

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