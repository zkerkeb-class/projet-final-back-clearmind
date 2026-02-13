const Box = require('../models/Box');

exports.createBox = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const newBox = await Box.create(req.body);

    res.status(201).json({ status: 'success', data: { box: newBox } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMyBoxes = async (req, res) => {
  try {
    const boxes = await Box.find({ author: req.user.id });
    res.status(200).json({ status: 'success', results: boxes.length, data: { boxes } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateBox = async (req, res) => {
  try {
    const box = await Box.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!box) return res.status(404).json({ message: "Machine non trouvée" });

    res.status(200).json({ status: 'success', data: { box } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};