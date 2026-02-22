const Payload = require('../models/Payload');
const Box = require('../models/Box');
const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');
const logController = require('./logController');

exports.globalSearch = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    const error = new Error("Veuillez fournir un mot-clé");
    error.statusCode = 400;
    return next(error);
  }

  await logController.createLog('GLOBAL_SEARCH', req.user.username, `Recherche: "${q}"`, 'info');

  const searchRegex = new RegExp(q, 'i');

  const [payloads, boxes, targets] = await Promise.all([
    Payload.find({ author: req.user.id, $or: [{ title: searchRegex }, { category: searchRegex }] }),
    Box.find({ author: req.user.id, $or: [{ name: searchRegex }, { notes: searchRegex }] }),
    Target.find({ author: req.user.id, $or: [{ name: searchRegex }, { domain: searchRegex }] })
  ]);

  res.status(200).json({
    status: 'success',
    data: { payloads, boxes, targets }
  });
});