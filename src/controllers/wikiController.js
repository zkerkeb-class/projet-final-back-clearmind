const Wiki = require('../models/Wiki');
const catchAsync = require('../utils/catchAsync');
const logController = require('./logController');

// 1. Récupérer toutes les entrées (pour la sidebar)
exports.getAllMethods = catchAsync(async (req, res, next) => {
  const methods = await Wiki.find().select('service port category').sort('port');
  
  res.status(200).json({
    status: 'success',
    results: methods.length,
    data: { methods }
  });
});

// 2. Récupérer une fiche spécifique par ID
exports.getMethod = catchAsync(async (req, res, next) => {
  const method = await Wiki.findById(req.params.id);

  if (!method) {
    return next(new Error('Aucune méthodologie trouvée avec cet ID'));
  }

  res.status(200).json({
    status: 'success',
    data: { method }
  });
});

// 3. Créer une nouvelle fiche
exports.createMethod = catchAsync(async (req, res, next) => {
  // On injecte l'ID de l'auteur depuis le middleware 'protect'
  req.body.author = req.user.id;
  
  const newMethod = await Wiki.create(req.body);

  await logController.createLog('WIKI_CREATED', req.user.username, `Nouvelle fiche port ${newMethod.port}`, 'success');

  res.status(201).json({
    status: 'success',
    data: { method: newMethod }
  });
});

// 4. Mettre à jour une fiche (utile pour le Wiki)
exports.updateMethod = catchAsync(async (req, res, next) => {
  const method = await Wiki.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!method) {
    return next(new Error('Impossible de modifier : ID introuvable'));
  }

  await logController.createLog('WIKI_UPDATED', req.user.username, `Mise à jour fiche port ${method.port}`, 'info');

  res.status(200).json({
    status: 'success',
    data: { method }
  });
});

exports.deleteMethod = catchAsync(async (req, res, next) => {
  const method = await Wiki.findByIdAndDelete(req.params.id);

  if (!method) {
    return next(new Error('Impossible de supprimer : ID introuvable'));
  }

  await logController.createLog('WIKI_DELETED', req.user.username, `Suppression fiche port ${method.port}`, 'warning');

  res.status(204).json({ status: 'success', data: null });
});