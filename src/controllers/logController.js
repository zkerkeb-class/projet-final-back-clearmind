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

// Méthode pour créer des logs depuis d'autres contrôleurs
exports.createLog = async (action, actor, details, level = 'info') => {
  try {
    await Log.create({ action, actor, details, level });
  } catch (err) {
    console.error('Erreur lors de la création du log:', err);
  }
};

// Endpoint pour créer des logs depuis le frontend (ex: Exports)
exports.createLogManual = catchAsync(async (req, res, next) => {
  const { action, details, level } = req.body;
  
  await Log.create({
    action: action || 'MANUAL_LOG',
    actor: req.user.username,
    details: details || 'Action utilisateur',
    level: level || 'info'
  });

  res.status(201).json({ status: 'success' });
});

exports.deleteAllLogs = catchAsync(async (req, res, next) => {
  await Log.deleteMany();
  
  // On crée une entrée pour logger la purge
  await Log.create({
    action: 'SYSTEM_PURGE',
    actor: req.user.username,
    details: 'Purge complète de l\'historique des logs',
    level: 'warning'
  });

  res.status(204).json({ status: 'success', data: null });
});