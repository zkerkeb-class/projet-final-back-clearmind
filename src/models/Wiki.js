const mongoose = require('mongoose');

const wikiSchema = new mongoose.Schema({
  port: {
    type: Number,
    required: [true, 'Le numéro de port est requis'],
    unique: true
  },
  service: {
    type: String,
    required: [true, 'Le nom du service est requis'],
    trim: true
  },
  category: {
    type: String,
    default: 'General'
  },
  content: {
    type: String,
    required: [true, 'Le contenu méthodologique est requis']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une fiche doit avoir un auteur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wiki', wikiSchema);