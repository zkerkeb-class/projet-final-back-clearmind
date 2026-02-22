const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');
const { ROLES } = require('../utils/constants');
const logController = require('./logController');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTargets = catchAsync(async (req, res, next) => {
  const queryObj = {};

  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { ip: { $regex: req.query.search, $options: 'i' } },
      { domain: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  if (req.query.os && req.query.os !== 'All') queryObj.os = req.query.os;
  if (req.query.status && req.query.status !== 'All') queryObj.status = req.query.status;

  // Filtrage par auteur (sauf pour les admins)
  if (req.user.role !== ROLES.ADMIN) {
    queryObj.author = req.user.id;
  }

  // Utilisation de APIFeatures pour la pagination et le tri
  const features = new APIFeatures(Target.find(queryObj).populate('linkedBox', 'name platform'), req.query)
    .sort()
    .paginate();

  const targets = await features.query;
  const total = await Target.countDocuments(queryObj);
  
  res.status(200).json({
    status: 'success',
    results: targets.length,
    total,
    totalPages: Math.ceil(total / (req.query.limit * 1 || 10)),
    currentPage: req.query.page * 1 || 1,
    data: { targets }
  });
});

exports.createTarget = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  let newTarget = await Target.create(req.body);
  newTarget = await newTarget.populate('linkedBox', 'name platform');

  await logController.createLog('TARGET_CREATED', req.user.username, `Ajout de la cible "${newTarget.name}"`, 'success');

  res.status(201).json({
    status: 'success',
    data: { target: newTarget }
  });
});

exports.deleteTarget = catchAsync(async (req, res, next) => {
  const target = await Target.findByIdAndDelete(req.params.id);
  
  if (target) {
    await logController.createLog('TARGET_DELETED', req.user.username, `Suppression de la cible "${target.name}"`, 'warning');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateTarget = catchAsync(async (req, res, next) => {
  const target = await Target.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('linkedBox', 'name platform');

  if (!target) {
    return next(new Error('Aucune cible trouvée avec cet ID'));
  }

  await logController.createLog('TARGET_UPDATED', req.user.username, `Mise à jour cible: ${target.name}`, 'info');

  res.status(200).json({ status: 'success', data: { target } });
});