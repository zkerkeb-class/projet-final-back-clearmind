const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');
const { ROLES } = require('../utils/constants');

exports.getAllTargets = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

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

  const targets = await Target.find(queryObj).populate('linkedBox', 'name platform').sort('-createdAt').skip(skip).limit(limit);
  const total = await Target.countDocuments(queryObj);
  
  res.status(200).json({
    status: 'success',
    results: targets.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: { targets }
  });
});

exports.createTarget = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  let newTarget = await Target.create(req.body);
  newTarget = await newTarget.populate('linkedBox', 'name platform');

  res.status(201).json({
    status: 'success',
    data: { target: newTarget }
  });
});

exports.deleteTarget = catchAsync(async (req, res, next) => {
  await Target.findByIdAndDelete(req.params.id);
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

  res.status(200).json({ status: 'success', data: { target } });
});