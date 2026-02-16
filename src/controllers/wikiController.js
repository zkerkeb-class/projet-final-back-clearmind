const Wiki = require('../models/Wiki');
const catchAsync = require('../utils/catchAsync');

// 1. Récupérer toutes les entrées (pour la sidebar)
exports.getAllMethods = catchAsync(async (req, res, next) => {
  const methods = await Wiki.find().select('title port category').sort('port');
  
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
    return next(new AppError('Aucune méthodologie trouvée avec cet ID', 404));
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
    return next(new AppError('Impossible de modifier : ID introuvable', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { method }
  });
});