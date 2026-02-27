const Methodology = require('../models/methodologyModel');
const catchAsync = require('../utils/catchAsync');

exports.getKillChain = catchAsync(async (req, res, next) => {
  const steps = await Methodology.find({ key: 'kill-chain' }).sort('stageNumber');

  res.status(200).json({
    status: 'success',
    results: steps.length,
    data: steps
  });
});