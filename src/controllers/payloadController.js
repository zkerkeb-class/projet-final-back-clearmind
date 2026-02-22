const Payload = require('../models/Payload');
const catchAsync = require('../utils/catchAsync');
const { ROLES } = require('../utils/constants');
const logController = require('./logController');

exports.getMyPayloads = catchAsync(async (req, res, next) => {
  const payloads = await Payload.find({ author: req.user.id });
  
  res.status(200).json({
    status: 'success',
    results: payloads.length,
    data: { payloads }
  });
});

exports.getPayload = catchAsync(async (req, res, next) => {
  const payload = await Payload.findById(req.params.id).populate('author', 'username');

  if (!payload) {
    const error = new Error("Payload introuvable");
    error.statusCode = 404;
    return next(error);
  }

  await logController.createLog('PAYLOAD_UPDATED', req.user.username, `Modification payload: ${payload.title}`, 'info');

  res.status(200).json({ status: 'success', data: { payload } });
});

exports.updatePayload = catchAsync(async (req, res, next) => {
  // L'admin peut tout modifier, sinon on vérifie l'auteur
  const query = { _id: req.params.id };
  if (req.user.role !== ROLES.ADMIN) query.author = req.user.id;

  const payload = await Payload.findOneAndUpdate(
    query, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!payload) {
    const error = new Error("Payload non trouvé ou non autorisé");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ status: 'success', data: { payload } });
});

exports.deletePayload = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };
  if (req.user.role !== ROLES.ADMIN) query.author = req.user.id;

  const payload = await Payload.findOneAndDelete(query);

  if (!payload) {
    const error = new Error("Payload non trouvé ou non autorisé");
    error.statusCode = 404;
    return next(error);
  }

  await logController.createLog('PAYLOAD_DELETED', req.user.username, `Suppression payload: ${payload.title}`, 'warning');

  res.status(204).json({ status: 'success', data: null });
});

exports.createPayload = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;

  const newPayload = await Payload.create(req.body);

  await logController.createLog('PAYLOAD_CREATED', req.user.username, `Nouveau payload: ${newPayload.title}`, 'success');

  res.status(201).json({
    status: 'success',
    data: { payload: newPayload }
  });
});

exports.getAllPayloads = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const payloads = await Payload.find(queryObj).populate('author', 'username');

  res.status(200).json({
    status: 'success',
    results: payloads.length,
    data: { payloads }
  });
});