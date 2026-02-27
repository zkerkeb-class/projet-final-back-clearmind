const mongoose = require('mongoose');

const methodologySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true, // ex: 'kill-chain'
    index: true
  },
  stageNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iconName: {
    type: String, // On stockera le nom de l'icône Lucide (ex: 'Target')
    default: 'Shield'
  },
  tools: [String] // Un tableau de noms d'outils
});

const Methodology = mongoose.model('Methodology', methodologySchema);
module.exports = Methodology;