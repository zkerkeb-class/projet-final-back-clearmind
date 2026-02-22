const Log = require('../models/Log');
const catchAsync = require('../utils/catchAsync');

exports.getAllLogs = catchAsync(async (req, res, next) => {
  // On récupère les 200 derniers logs, du plus récent au plus ancien
  const logs = await Log.find().sort('-timestamp').limit(200);

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: { logs }
  });
});

// Méthode interne pour créer des logs depuis d'autres contrôleurs
exports.createLog = async (action, actor, details, level = 'info') => {
  try {
    await Log.create({ action, actor, details, level });
  } catch (err) {
    console.error('Erreur lors de la création du log:', err);
  }
};