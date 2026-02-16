const Payload = require('../models/Payload');
const catchAsync = require('../utils/catchAsync');

exports.getMyPayloads = catchAsync(async (req, res, next) => {
  const payloads = await Payload.find({ author: req.user.id });
  
  res.status(200).json({
    status: 'success',
    results: payloads.length,
    data: { payloads }
  });
});

exports.updatePayload = catchAsync(async (req, res, next) => {
  const payload = await Payload.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id }, 
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
  const payload = await Payload.findOneAndDelete({ _id: req.params.id, author: req.user.id });

  if (!payload) {
    const error = new Error("Payload non trouvé ou non autorisé");
    error.statusCode = 404;
    return next(error);
  }

  res.status(204).json({ status: 'success', data: null });
});

exports.createPayload = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;

  const newPayload = await Payload.create(req.body);

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