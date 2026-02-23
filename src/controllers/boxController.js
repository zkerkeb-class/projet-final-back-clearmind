const Box = require('../models/Box');
const Target = require('../models/Target');
const catchAsync = require('../utils/catchAsync');
const { ROLES } = require('../utils/constants');
const logController = require('./logController');
const filterObj = require('../utils/filterObj');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllBoxes = catchAsync(async (req, res, next) => {
  // Construction du filtre dynamique
  const queryObj = {};
  
  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { ipAddress: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  if (req.query.difficulty && req.query.difficulty !== 'All') queryObj.difficulty = req.query.difficulty;
  if (req.query.platform && req.query.platform !== 'All') queryObj.platform = req.query.platform;
  if (req.query.category && req.query.category !== 'All') queryObj.category = req.query.category;
  if (req.query.os && req.query.os !== 'All') queryObj.os = req.query.os;

  // Filtrage par auteur (sauf pour les admins)
  if (req.user.role !== ROLES.ADMIN) {
    queryObj.author = req.user.id;
  }

  // Utilisation de APIFeatures pour la pagination et le tri
  const features = new APIFeatures(Box.find(queryObj), req.query)
    .sort()
    .paginate();

  const boxes = await features.query;
  const total = await Box.countDocuments(queryObj);
  
  res.status(200).json({
    status: 'success',
    results: boxes.length,
    total,
    totalPages: Math.ceil(total / (req.query.limit * 1 || 12)),
    currentPage: req.query.page * 1 || 1,
    data: { boxes } // Format attendu par le frontend: res.data.data.boxes
  });
});

exports.getBox = catchAsync(async (req, res, next) => {
  // Protection IDOR : On vérifie que la box appartient à l'utilisateur (sauf Admin)
  const query = { _id: req.params.id };
  if (req.user.role !== ROLES.ADMIN) query.author = req.user.id;

  const box = await Box.findOne(query);

  if (!box) {
    return next(new Error('Box introuvable ou accès refusé'));
  }

  // Récupérer les cibles liées à cette box (Reconnaissance)
  // On s'assure de ne récupérer que les cibles appartenant à l'utilisateur (sauf Admin)
  const targetQuery = { linkedBox: req.params.id };
  if (req.user.role !== ROLES.ADMIN) targetQuery.author = req.user.id;

  const linkedTargets = await Target.find(targetQuery);
  const boxData = box.toObject();
  boxData.linkedTargets = linkedTargets;

  res.status(200).json({ status: 'success', data: boxData });
});

exports.createBox = catchAsync(async (req, res, next) => {
  // Protection Mass Assignment : On ne garde que les champs autorisés
  const filteredBody = filterObj(req.body, 'name', 'ipAddress', 'platform', 'difficulty', 'category', 'os', 'status', 'notes');
  filteredBody.author = req.user.id;

  const newBox = await Box.create(filteredBody);

  await logController.createLog('BOX_CREATED', req.user.username, `Création de la box "${newBox.name}"`, 'success');

  res.status(201).json({
    status: 'success',
    data: newBox // Format attendu par le frontend: res.data.data
  });
});

exports.deleteBox = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };
  if (req.user.role !== ROLES.ADMIN) query.author = req.user.id;

  const box = await Box.findOneAndDelete(query);

  if (!box) {
    return next(new Error('Aucune box trouvée ou accès refusé'));
  }

  await logController.createLog('BOX_DELETED', req.user.username, `Suppression de la box "${box.name}"`, 'warning');

  res.status(204).json({ status: 'success', data: null });
});

exports.updateBox = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };
  if (req.user.role !== ROLES.ADMIN) query.author = req.user.id;

  const filteredBody = filterObj(req.body, 'name', 'ipAddress', 'platform', 'difficulty', 'category', 'os', 'status', 'notes');

  const box = await Box.findOneAndUpdate(query, filteredBody, { new: true, runValidators: true });
  
  if (!box) {
    return next(new Error('Box introuvable ou accès refusé'));
  }

  await logController.createLog('BOX_UPDATED', req.user.username, `Mise à jour box: ${box.name}`, 'info');

  res.status(200).json({ status: 'success', data: box });
});