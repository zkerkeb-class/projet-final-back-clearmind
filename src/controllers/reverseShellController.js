const ReverseShell = require('../models/ReverseShell');
const catchAsync = require('../utils/catchAsync');

exports.getAllShells = catchAsync(async (req, res, next) => {
  const shells = await ReverseShell.find().sort('category name');
  res.status(200).json({
    status: 'success',
    results: shells.length,
    data: { shells }
  });
});

exports.createShell = catchAsync(async (req, res, next) => {
  const newShell = await ReverseShell.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { shell: newShell }
  });
});

exports.updateShell = catchAsync(async (req, res, next) => {
  const shell = await ReverseShell.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!shell) return next(new Error('Shell introuvable'));
  res.status(200).json({
    status: 'success',
    data: { shell }
  });
});

exports.deleteShell = catchAsync(async (req, res, next) => {
  const shell = await ReverseShell.findByIdAndDelete(req.params.id);
  if (!shell) return next(new Error('Shell introuvable'));
  res.status(204).json({
    status: 'success',
    data: null
  });
});