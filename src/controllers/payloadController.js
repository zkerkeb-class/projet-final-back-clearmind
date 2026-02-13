const Payload = require('../models/Payload');

// Récupérer UNIQUEMENT mes payloads
exports.getMyPayloads = async (req, res) => {
  try {
    const payloads = await Payload.find({ author: req.user.id });
    
    res.status(200).json({
      status: 'success',
      results: payloads.length,
      data: { payloads }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Mettre à jour un payload (seulement si on en est l'auteur)
exports.updatePayload = async (req, res) => {
  try {
    const payload = await Payload.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id }, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!payload) {
      return res.status(404).json({ message: "Payload non trouvé ou vous n'avez pas l'autorisation" });
    }

    res.status(200).json({ status: 'success', data: { payload } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deletePayload = async (req, res) => {
  try {
    const payload = await Payload.findOneAndDelete({ _id: req.params.id, author: req.user.id });

    if (!payload) {
      return res.status(404).json({ message: "Payload non trouvé ou vous n'avez pas l'autorisation" });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createPayload = async (req, res) => {
  try {
    // On ajoute l'ID de l'utilisateur connecté au body avant la création
    if (!req.body.author) req.body.author = req.user.id;

    const newPayload = await Payload.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { payload: newPayload }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllPayloads = async (req, res) => {
  try {
    // Filtrage basique (ex: ?category=XSS&severity=High)
    const queryObj = { ...req.query };
    const payloads = await Payload.find(queryObj).populate('author', 'username');

    res.status(200).json({
      status: 'success',
      results: payloads.length,
      data: { payloads }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};