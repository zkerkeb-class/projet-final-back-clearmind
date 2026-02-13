const Target = require('../models/Target');

exports.createTarget = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const newTarget = await Target.create(req.body);
    res.status(201).json({ status: 'success', data: { target: newTarget } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMyTargets = async (req, res) => {
  try {
    const targets = await Target.find({ author: req.user.id });
    res.status(200).json({ status: 'success', results: targets.length, data: { targets } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};