const mongoose = require('mongoose');

const reverseShellSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Une catégorie est requise (ex: Bash, Python)']
  },
  name: {
    type: String,
    required: [true, 'Un nom est requis'],
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Le code du shell est requis']
  }
});

module.exports = mongoose.model('ReverseShell', reverseShellSchema);