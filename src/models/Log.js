const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Une action est requise']
  },
  actor: {
    type: String,
    required: [true, 'Un acteur est requis']
  },
  details: {
    type: String
  },
  level: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);