const Box = require('../models/Box');
const catchAsync = require('../utils/catchAsync');

exports.createBox = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  const newBox = await Box.create(req.body);

  res.status(201).json({ status: 'success', data: { box: newBox } });
});

exports.getMyBoxes = catchAsync(async (req, res, next) => {
  const boxes = await Box.find({ author: req.user.id });
  res.status(200).json({ status: 'success', results: boxes.length, data: { boxes } });
});

exports.updateBox = catchAsync(async (req, res, next) => {
  const box = await Box.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!box) {
    const error = new Error("Machine non trouvée");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ status: 'success', data: { box } });
});