const mongoose = require('mongoose');
const { BOX_PLATFORMS, BOX_DIFFICULTIES, BOX_STATUSES } = require('../utils/constants');

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Une box doit avoir un nom'],
    unique: true,
    trim: true
  },
  ipAddress: {
    type: String,
    required: [true, 'Une adresse IP est requise'],
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Adresse IP invalide']
  },
  platform: {
    type: String,
    enum: Object.values(BOX_PLATFORMS),
    default: BOX_PLATFORMS.HTB
  },
  difficulty: {
    type: String,
    enum: Object.values(BOX_DIFFICULTIES),
    default: BOX_DIFFICULTIES.EASY
  },
  status: {
    type: String,
    enum: Object.values(BOX_STATUSES),
    default: BOX_STATUSES.TODO
  },
  notes: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une box doit appartenir à un utilisateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Box', boxSchema);