const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');

exports.createTarget = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  const newTarget = await Target.create(req.body);
  res.status(201).json({ status: 'success', data: { target: newTarget } });
});

exports.getMyTargets = catchAsync(async (req, res, next) => {
  const targets = await Target.find({ author: req.user.id });
  res.status(200).json({ status: 'success', results: targets.length, data: { targets } });
});