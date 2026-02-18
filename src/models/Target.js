const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la cible est requis'],
    trim: true
  },
  ip: {
    type: String,
    required: [true, 'L\'adresse IP est requise'],
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Adresse IP invalide']
  },
  domain: {
    type: String,
    trim: true
  },
  os: {
    type: String,
    enum: ['Windows', 'Linux', 'MacOS', 'Android', 'iOS', 'Unknown'],
    default: 'Unknown'
  },
  ports: {
    type: [String], // Ex: ["80/tcp", "443/tcp", "3306/tcp"]
    default: []
  },
  status: {
    type: String,
    enum: ['Discovery', 'Scanning', 'Vulnerable', 'Compromised', 'Patched'],
    default: 'Discovery'
  },
  linkedBox: {
    type: mongoose.Schema.ObjectId,
    ref: 'Box',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Target', targetSchema);