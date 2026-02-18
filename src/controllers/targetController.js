const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');

exports.getAllTargets = catchAsync(async (req, res, next) => {
  const targets = await Target.find().populate('linkedBox', 'name platform').sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: targets.length,
    data: { targets }
  });
});

exports.createTarget = catchAsync(async (req, res, next) => {
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