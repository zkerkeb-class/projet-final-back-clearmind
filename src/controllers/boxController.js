const Box = require('../models/Box');
const catchAsync = require('../utils/catchAsync');

exports.getAllBoxes = catchAsync(async (req, res, next) => {
  const boxes = await Box.find().sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: boxes.length,
    data: { boxes } // Format attendu par le frontend: res.data.data.boxes
  });
});

exports.getBox = catchAsync(async (req, res, next) => {
  const box = await Box.findById(req.params.id);

  if (!box) {
    return next(new Error('Box introuvable'));
  }
  res.status(200).json({ status: 'success', data: box });
});

exports.createBox = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  const newBox = await Box.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newBox // Format attendu par le frontend: res.data.data
  });
});

exports.deleteBox = catchAsync(async (req, res, next) => {
  const box = await Box.findByIdAndDelete(req.params.id);

  if (!box) {
    return next(new Error('Aucune box trouvée avec cet ID'));
  }

  res.status(204).json({ status: 'success', data: null });
});

exports.updateBox = catchAsync(async (req, res, next) => {
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ status: 'success', data: box });
});