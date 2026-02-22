const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const logController = require('../controllers/logController');

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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logController.createLog('ACCESS_DENIED', req.user.username, `Tentative d'accès non autorisé à ${req.originalUrl}`, 'warning');
      const error = new Error("Permission refusée");
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};