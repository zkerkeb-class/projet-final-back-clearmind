const Tool = require('../models/toolModel');
const Methodology = require('../models/methodologyModel');
const catchAsync = require('../utils/catchAsync');

// Utilitaire pour échapper les caractères spéciaux dans les regex (Sécurité)
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

exports.getToolByName = catchAsync(async (req, res, next) => {
  // On décode l'URL et on cherche sans tenir compte de la casse
  const decodedName = decodeURIComponent(req.params.name);
  const safeName = escapeRegex(decodedName);
  
  const tool = await Tool.findOne({ 
    name: { $regex: new RegExp(`^${safeName}$`, 'i') } 
  });

  if (!tool) {
    // Retourne une vraie 404 pour que le front déclenche le mode "Erreur"
    return res.status(404).json({ status: 'fail', message: "Outil non trouvé" });
  }
  
  res.status(200).json({ status: 'success', data: tool });
});

exports.createTool = catchAsync(async (req, res, next) => {
  // Protection XSS basique sur les liens
  if (req.body.link && /^\s*javascript:/i.test(req.body.link)) {
    return next(new Error("Lien invalide : protocole non autorisé"));
  }

  const newTool = await Tool.create(req.body);
  
  // Synchronisation automatique avec la Kill Chain
  await Methodology.findOneAndUpdate(
    { title: newTool.category, key: 'kill-chain' },
    { $addToSet: { tools: newTool.name } }
  );

  res.status(201).json({ status: 'success', data: newTool });
});

exports.updateTool = catchAsync(async (req, res, next) => {
  // Protection XSS basique sur les liens
  if (req.body.link && /^\s*javascript:/i.test(req.body.link)) {
    return next(new Error("Lien invalide : protocole non autorisé"));
  }

  const tool = await Tool.findOneAndUpdate({ name: req.params.name }, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ status: 'success', data: tool });
});

exports.deleteTool = catchAsync(async (req, res, next) => {
  // On cherche par 'name' (insensible à la casse pour plus de sécurité)
  const safeName = escapeRegex(req.params.name);
  const tool = await Tool.findOneAndDelete({ 
    name: { $regex: new RegExp(`^${safeName}$`, 'i') } 
  });

  if (!tool) {
    const error = new Error("Impossible de supprimer : outil introuvable");
    error.statusCode = 404;
    return next(error);
  }

  // Retrait automatique de la Kill Chain
  await Methodology.findOneAndUpdate(
    { title: tool.category, key: 'kill-chain' },
    { $pull: { tools: tool.name } }
  );

  // Statut 204 : Succès sans contenu à renvoyer
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllTools = catchAsync(async (req, res, next) => {
  const tools = await Tool.find().sort('name');
  res.status(200).json({
    status: 'success',
    results: tools.length,
    data: tools
  });
});