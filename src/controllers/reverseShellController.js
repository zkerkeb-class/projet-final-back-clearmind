const ReverseShell = require('../models/ReverseShell');
const catchAsync = require('../utils/catchAsync');
const logController = require('./logController');

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

  await logController.createLog('SHELL_CREATED', req.user.username, `Nouveau shell: ${newShell.name}`, 'success');

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

  await logController.createLog('SHELL_UPDATED', req.user.username, `Modification shell: ${shell.name}`, 'info');

  res.status(200).json({
    status: 'success',
    data: { shell }
  });
});

exports.deleteShell = catchAsync(async (req, res, next) => {
  const shell = await ReverseShell.findByIdAndDelete(req.params.id);
  if (!shell) return next(new Error('Shell introuvable'));

  await logController.createLog('SHELL_DELETED', req.user.username, `Suppression shell: ${shell.name}`, 'warning');

  res.status(204).json({
    status: 'success',
    data: null
  });
});