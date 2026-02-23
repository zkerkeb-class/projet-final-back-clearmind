const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const logController = require('./logController');
const filterObj = require('../utils/filterObj');

// CONFIGURATION MULTER (SÉCURITÉ UPLOAD)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/img/users';
    // Création automatique du dossier s'il n'existe pas
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); 
  },
  filename: (req, file, cb) => {
    // Renommage aléatoire pour éviter l'écrasement et les noms de fichiers malveillants
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(12).toString('hex');
    cb(null, `user-${randomName}${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  // 1. Vérification du MIME Type (Whitelist)
  if (file.mimetype.startsWith('image/')) {
    // 2. Vérification de l'extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Extension de fichier non autorisée. Images uniquement.'), false);
    }
  } else {
    cb(new Error('Format de fichier invalide. Veuillez uploader une image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite à 2MB (Protection DoS)
    files: 1 // Un seul fichier à la fois
  }
});

exports.uploadUserPhoto = upload.single('photo');

// UTILITAIRES
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret-dev-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  // Validation Mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if (!passwordRegex.test(req.body.password)) {
    return next(new Error("Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule et un caractère spécial."));
  }

  // Préparation de l'objet utilisateur
  const newUserObj = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  // Gestion de la photo si uploadée
  if (req.file) {
    newUserObj.photo = req.file.filename;
  }

  const newUser = await User.create(newUserObj);
  const token = signToken(newUser._id, newUser.role);

  await logController.createLog('USER_SIGNUP', newUser.username, 'Nouvelle inscription', 'success');

  // Suppression du mot de passe de la réponse
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    role: newUser.role,
    data: { user: newUser }
  });
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error('Veuillez fournir un email et un mot de passe'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    await logController.createLog('LOGIN_FAILED', email || 'UNKNOWN', 'Échec authentification', 'warning');
    return next(new Error('Email ou mot de passe incorrect'));
  }

  await logController.createLog('USER_LOGIN', user.username, 'Connexion réussie', 'info');
  const token = signToken(user._id, user.role);
  res.status(200).json({ status: 'success', token, role: user.role, data: { user } });
});

// UPDATE CURRENT USER
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Erreur si l'utilisateur tente de changer son mot de passe ici
  if (req.body.password || req.body.passwordConfirm) {
    return next(new Error('Cette route n\'est pas pour la modification de mot de passe. Utilisez /updateMyPassword.'));
  }

  // 2. Filtrer les champs non autorisés (ex: role)
  const filteredBody = filterObj(req.body, 'username', 'email');
  
  // Récupérer l'utilisateur actuel pour avoir l'ancien nom de fichier
  const currentUser = await User.findById(req.user.id);

  // Fonction de suppression sécurisée
  const deletePhotoFile = (filename) => {
    if (filename && filename !== 'default.jpg') {
      const filePath = path.join(__dirname, '../../public/img/users', filename);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') console.error('Erreur suppression image:', err);
      });
    }
  };

  if (req.file) {
    filteredBody.photo = req.file.filename;
    deletePhotoFile(currentUser.photo);
  } else if (req.body.deletePhoto === 'true') {
    // Si pas de nouvelle photo mais demande de suppression
    filteredBody.photo = 'default.jpg';
    deletePhotoFile(currentUser.photo);
  }

  // 3. Mettre à jour le document utilisateur
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  await logController.createLog('PROFILE_UPDATE', req.user.username, 'Mise à jour du profil', 'info');

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // 1. Récupérer l'utilisateur avec le mot de passe (car select: false par défaut)
  const user = await User.findById(req.user.id).select('+password');

  // 2. Vérifier si le mot de passe actuel est correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new Error('Votre mot de passe actuel est incorrect.'));
  }

  // 3. Mettre à jour le mot de passe (Le middleware pre('save') du modèle User va le hacher)
  user.password = req.body.password;
  await user.save();

  await logController.createLog('PASSWORD_CHANGE', user.username, 'Changement de mot de passe', 'info');

  // 4. Renvoyer un nouveau token (car le changement de mot de passe invalide souvent les sessions)
  const token = signToken(user._id, user.role);
  res.status(200).json({ status: 'success', token, data: { user } });
});

// USER CRUD (ADMIN)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'guest'
  });
  
  newUser.password = undefined;
  res.status(201).json({
    status: 'success',
    data: { user: newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return next(new Error('Aucun utilisateur trouvé avec cet ID'));
  await logController.createLog('USER_UPDATED', req.user.username, `Modification de l'utilisateur ${user.username}`, 'warning');
  res.status(200).json({ status: 'success', data: { user } });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new Error('Aucun utilisateur trouvé avec cet ID'));
  await logController.createLog('USER_DELETED', req.user.username, `Suppression de l'utilisateur ${user.username}`, 'warning');
  res.status(204).json({ status: 'success', data: null });
});
