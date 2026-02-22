const mongoose = require('mongoose');
const { TARGET_OS, TARGET_STATUSES, IPV4_REGEX } = require('../utils/constants');

const targetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la cible est requis'],
    trim: true
  },
  ip: {
    type: String,
    required: [true, 'L\'adresse IP est requise'],
    match: [IPV4_REGEX, 'Adresse IP invalide']
  },
  domain: {
    type: String,
    trim: true
  },
  os: {
    type: String,
    enum: Object.values(TARGET_OS),
    default: TARGET_OS.UNKNOWN
  },
  ports: {
    type: [{
      port: {
        type: String,
        match: [/^\d+$/, 'Le port doit être un nombre valide']
      },
      service: String
    }],
    default: []
  },
  status: {
    type: String,
    enum: Object.values(TARGET_STATUSES),
    default: TARGET_STATUSES.DISCOVERY
  },
  linkedBox: {
    type: mongoose.Schema.ObjectId,
    ref: 'Box',
    default: null
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une cible doit appartenir à un utilisateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Target', targetSchema);