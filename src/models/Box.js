const mongoose = require('mongoose');
const { BOX_PLATFORMS, BOX_DIFFICULTIES, BOX_STATUSES, BOX_CATEGORIES, TARGET_OS, IPV4_REGEX } = require('../utils/constants');

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
    match: [IPV4_REGEX, 'Adresse IP invalide']
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
  os: {
    type: String,
    enum: Object.values(TARGET_OS),
    default: TARGET_OS.LINUX
  },
  category: {
    type: String,
    enum: Object.values(BOX_CATEGORIES),
    default: BOX_CATEGORIES.RED
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